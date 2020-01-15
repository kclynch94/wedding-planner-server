const path = require('path')
const express = require('express')
const xss = require('xss')
const PhotographersService = require('./photographers-service')
const ProsService = require('../pros/pros-service')
const ConsService = require('../cons/cons-service')
const {requireAuth} = require('../middleware/jwt-auth')

const photographersRouter = express.Router()
const jsonParser = express.json()

const serializePhotographer = photographer => {
    return {
        id: photographer.id,
        photographer_name: xss(photographer.photographer_name),
        photographer_website: xss(photographer.photographer_website),
        photographer_price: photographer.photographer_price,
        photographer_rating: photographer.photographer_rating,
        user_id: photographer.user_id
    }
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

photographersRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            PhotographersService.getAllPhotographers(knexInstance, req.user.id)
                .then(photographers => {
                    const serializedPhotographers = photographers.map(serializePhotographer)
                    const prosPromises = []
                    const consPromises = []
                    serializedPhotographers.forEach(p => {
                        prosPromises.push(ProsService.getAllProsBy(knexInstance, req.user.id, 'photographer', p.id ))
                        consPromises.push(ConsService.getAllConsBy(knexInstance, req.user.id, 'photographer', p.id ))
                    })
                    const promises = [...prosPromises, ...consPromises]
                    Promise.all(promises).then(data => {
                        console.log('get data', data)
                        const photographer_pros=flatten(data).filter(d => d.hasOwnProperty('pro_type'))
                        const photographer_cons=flatten(data).filter(d => d.hasOwnProperty('con_type'))
                        console.log('pros', photographer_pros)
                        const svs = serializedPhotographers.map(ph => {
                            const ps = photographer_pros.filter(p => p.ref_id === ph.id)
                            const cs = photographer_cons.filter(c => c.ref_id === ph.id)
                            return {...ph, photographer_pros: ps, photographer_cons:cs}
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
        console.log('post req body', req.body)
        const { photographer_name, photographer_website, photographer_pros, photographer_cons } = req.body
        const newPhotographer = { photographer_name, photographer_website, user_id: req.user.id }
        const requiredFields = { photographer_name }

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            PhotographersService.insertPhotographer(
                req.app.get('db'),
                newPhotographer
            )
                .then(photographer => {
                    const pros = []
                    const cons = []

                    if(photographer_pros && photographer_pros.length) {
                        photographer_pros.forEach(p => {
                            const newPro = { pro_content: p, pro_type: 'photographer', ref_id: photographer.id, user_id: photographer.user_id }
                            pros.push(ProsService.insertPro(
                                req.app.get('db'),
                                newPro
                            ))
                        })
                    }

                    if(photographer_cons && photographer_cons.length) {
                        photographer_cons.forEach(c => {
                            const newCon = { con_content: c, con_type: 'photographer', ref_id: photographer.id, user_id: photographer.user_id }
                            cons.push(ConsService.insertCon(
                                req.app.get('db'),
                                newCon
                            ))
                        })
                    }

                    const promises = [...pros, ...cons]
                    Promise.all(promises).then((data)=> {
                        console.log('data', data)
                        const serializedPhotographer = serializePhotographer(photographer)
                        serializedPhotographer.photographer_pros=data.filter(d => d.hasOwnProperty('pro_type'))
                        serializedPhotographer.photographer_cons=data.filter(d => d.hasOwnProperty('con_type'))
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${photographer.id}`))
                            .json(serializedPhotographer)
                    })
                })
                .catch(next)
    })

photographersRouter
    .route('/:photographer_id')
    .all(requireAuth)
    .all((req, res, next) => {
        PhotographersService.getById(
            req.app.get('db'),
            req.params.photographer_id
        )
            .then(photographer => {
                if (!photographer) {
                    return res.status(404).json({
                        error: { message: `Photographer doesn't exist` }
                    })
                }
                res.photographer = photographer
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        PhotographersService.deletePhotographer(
            req.app.get('db'),
            req.params.photographer_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, async(req, res, next) => {
        const knexInstance = req.app.get('db')
        const { photographer_name, photographer_website, photographer_price, photographer_rating, photographer_pros, photographer_cons } = req.body
        const photographerToUpdate = { photographer_name, photographer_website, photographer_price, photographer_rating }

        PhotographersService.updatePhotographer(
            knexInstance,
            req.params.photographer_id,
            photographerToUpdate
        )
        .then(async (numRowsAffected) => {
            const prosToUpdate = []
            const prosToDelete = []
            const prosToCreate = []
            const consToUpdate = []
            const consToDelete = []
            const consToCreate = []
            //1. Update existing pros/cons or create pros/cons that do not have an id
            if(photographer_pros && photographer_pros.length) {
                const currentPros = await ProsService.getAllProsBy(knexInstance, req.user.id, 'photographer', req.params.photographer_id )
                const currentProsIds = currentPros.map(p => p.id)
                const requestProsIds = photographer_pros.map(p => p.id)
                const proIdsToDelete = currentProsIds.filter(id => !requestProsIds.includes(id))

                photographer_pros.forEach(p => {
                    if (currentProsIds.includes(p.id)) {
                        prosToUpdate.push(ProsService.updatePro(knexInstance, p.id, {pro_content: p.pro_content}))
                    } else {
                        prosToCreate.push(ProsService.insertPro(knexInstance, {pro_type: 'photographer', pro_content: p.pro_content, ref_id: req.params.photographer_id, user_id: req.user.id}))
                    }
                })

                proIdsToDelete.forEach(id => {
                    prosToDelete.push(ProsService.deletePro(knexInstance, id))
                })
            }

            if(photographer_cons && photographer_cons.length) {
                const currentCons = await ConsService.getAllConsBy(knexInstance, req.user.id, 'photographer', req.params.photographer_id )
                const currentConsIds = currentCons.map(c => c.id)
                const requestConsIds = photographer_cons.map(c => c.id)
                const conIdsToDelete = currentConsIds.filter(id => !requestConsIds.includes(id))
                
                photographer_cons.forEach(c => {
                    if (currentConsIds.includes(c.id)) {
                        consToUpdate.push(ConsService.updateCon(knexInstance, c.id, {con_content: c.con_content}))
                    } else {
                        consToCreate.push(ConsService.insertCon(knexInstance, {con_type: 'photographer', con_content: c.con_content, ref_id: req.params.photographer_id, user_id: req.user.id}))
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
                        .location(path.posix.join(req.originalUrl, `/${req.params.photographer_id}`))
                        .json(photographerToUpdate)
        })
            .catch(next)
    })

module.exports = photographersRouter