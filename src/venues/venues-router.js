const path = require('path')
const express = require('express')
const xss = require('xss')
const VenuesService = require('./venues-service')
const ProsService = require('../pros/pros-service')
const ConsService = require('../cons/cons-service')
const {requireAuth} = require('../middleware/jwt-auth')

const venuesRouter = express.Router()
const jsonParser = express.json()

const serializeVenue = venue => {
    return {
        id: venue.id,
        venue_name: xss(venue.venue_name),
        venue_website: xss(venue.venue_website),
        venue_price: venue.venue_price,
        venue_rating: venue.venue_rating,
        venue_capacity: venue.venue_capacity,
        user_id: venue.user_id
    }
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

venuesRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            VenuesService.getAllVenues(knexInstance, req.user.id)
                .then(venues => {
                    const serializedVenues = venues.map(serializeVenue)
                    const prosPromises = []
                    const consPromises = []
                    serializedVenues.forEach(v => {
                        prosPromises.push(ProsService.getAllProsBy(knexInstance, req.user.id, 'venue', v.id ))
                        consPromises.push(ConsService.getAllConsBy(knexInstance, req.user.id, 'venue', v.id ))
                    })
                    const promises = [...prosPromises, ...consPromises]
                    Promise.all(promises).then(data => {
                        const venue_pros=flatten(data).filter(d => d.hasOwnProperty('pro_type'))
                        const venue_cons=flatten(data).filter(d => d.hasOwnProperty('con_type'))
                        const svs = serializedVenues.map(v => {
                            const ps = venue_pros.filter(p => p.ref_id === v.id)
                            const cs = venue_cons.filter(c => c.ref_id === v.id)
                            return {...v, venue_pros: ps, venue_cons:cs}
                        })
                        res.json(svs)
                    })
                    
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { venue_name, venue_website, venue_rating, venue_capacity, venue_price, venue_pros, venue_cons } = req.body
        const newVenue = { venue_name, venue_website, venue_rating, venue_capacity, venue_price, user_id: req.user.id }
        const requiredFields = {venue_name}

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            VenuesService.insertVenue(
                req.app.get('db'),
                newVenue
            )
                .then(venue => {
                    const pros = []
                    const cons = []

                    if(venue_pros && venue_pros.length) {
                        venue_pros.forEach(p => {
                            const newPro = { pro_content: p, pro_type: 'venue', ref_id: venue.id, user_id: venue.user_id }
                            pros.push(ProsService.insertPro(
                                req.app.get('db'),
                                newPro
                            ))
                        })
                    }

                    if(venue_cons && venue_cons.length) {
                        venue_cons.forEach(c => {
                            const newCon = { con_content: c, con_type: 'venue', ref_id: venue.id, user_id: venue.user_id }
                            cons.push(ConsService.insertCon(
                                req.app.get('db'),
                                newCon
                            ))
                        })
                    }

                    const promises = [...pros, ...cons]
                    Promise.all(promises).then((data)=> {
                        const serializedVenue = serializeVenue(venue)
                        serializedVenue.venue_pros=data.filter(d => d.hasOwnProperty('pro_type'))
                        serializedVenue.venue_cons=data.filter(d => d.hasOwnProperty('con_type'))
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${venue.id}`))
                            .json(serializedVenue)
                    })
                })
                .catch(next)
    })

venuesRouter
    .route('/:venue_id')
    .all(requireAuth)
    .all((req, res, next) => {
        VenuesService.getById(
            req.app.get('db'),
            req.params.venue_id
        )
            .then(venue => {
                if (!venue) {
                    return res.status(404).json({
                        error: { message: `Venue doesn't exist` }
                    })
                }
                res.venue = venue
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        VenuesService.deleteVenue(
            req.app.get('db'),
            req.params.venue_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, async(req, res, next) => {
        const knexInstance = req.app.get('db')
        const { venue_name, venue_website, venue_price, venue_rating, venue_capacity, venue_pros, venue_cons } = req.body
        const venueToUpdate = { venue_name, venue_website, venue_price, venue_rating, venue_capacity }

        VenuesService.updateVenue(
            knexInstance,
            req.params.venue_id,
            venueToUpdate
        )
            .then(async (numRowsAffected) => {
                const prosToUpdate = []
                const prosToDelete = []
                const prosToCreate = []
                const consToUpdate = []
                const consToDelete = []
                const consToCreate = []
                //1. Update existing pros/cons or create pros/cons that do not have an id
                if(venue_pros && venue_pros.length) {
                    const currentPros = await ProsService.getAllProsBy(knexInstance, req.user.id, 'venue', req.params.venue_id )
                    const currentProsIds = currentPros.map(p => p.id)
                    const requestProsIds = venue_pros.map(p => p.id)
                    const proIdsToDelete = currentProsIds.filter(id => !requestProsIds.includes(id))

                    venue_pros.forEach(p => {
                        if (currentProsIds.includes(p.id)) {
                            prosToUpdate.push(ProsService.updatePro(knexInstance, p.id, {pro_content: p.pro_content}))
                        } else {
                            prosToCreate.push(ProsService.insertPro(knexInstance, {pro_type: 'venue', pro_content: p.pro_content, ref_id: req.params.venue_id, user_id: req.user.id}))
                        }
                    })

                    proIdsToDelete.forEach(id => {
                        prosToDelete.push(ProsService.deletePro(knexInstance, id))
                    })
                }

                if(venue_cons && venue_cons.length) {
                    const currentCons = await ConsService.getAllConsBy(knexInstance, req.user.id, 'venue', req.params.venue_id )
                    const currentConsIds = currentCons.map(c => c.id)
                    const requestConsIds = venue_cons.map(c => c.id)
                    const conIdsToDelete = currentConsIds.filter(id => !requestConsIds.includes(id))
                    
                    venue_cons.forEach(c => {
                        if (currentConsIds.includes(c.id)) {
                            consToUpdate.push(ConsService.updateCon(knexInstance, c.id, {con_content: c.con_content}))
                        } else {
                            consToCreate.push(ConsService.insertCon(knexInstance, {con_type: 'venue', con_content: c.con_content, ref_id: req.params.venue_id, user_id: req.user.id}))
                        }
                    })

                    conIdsToDelete.forEach(id => {
                        consToDelete.push(ConsService.deleteCon(knexInstance, id))
                    })
                }
                
                
                //2. Delete the pros/cons that do not exist anymore
               
                
                const promises = [...prosToUpdate, ...prosToDelete, ...prosToCreate, ...consToUpdate, ...consToDelete, ...consToCreate]
                await Promise.all(promises)
                return res
                    .status(204)
                    .location(path.posix.join(req.originalUrl, `/${req.params.venue_id}`))
                    .json(venueToUpdate)
            })
            .catch(next)
    })

module.exports = venuesRouter