const path = require('path')
const express = require('express')
const xss = require('xss')
const VenuesService = require('./venues-service')
const User = require('../models/user.js')
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
        venue_pros: xss(venue.venue_pros),
        venue_cons: xss(venue.venue_cons),
        user_id: venue.user_id
    }
}

venuesRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            VenuesService.getAllVenues(knexInstance, req.user.id)
                .then(venues => {
                    res.json(venues.map(serializeVenue))
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { venue_name, venue_website, venue_price, venue_rating, venue_capacity, venue_pros, venue_cons, user_id } = req.body
        const newVenue = { venue_name, venue_website, venue_price, venue_rating, venue_capacity, venue_pros, venue_cons, user_id }

        for (const [key, value] of Object.entries(newVenue))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            VenuesService.insertVenue(
                req.app.get('db'),
                newVenue
            )
                .then(venue => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${venue.id}`))
                        .json(serializeVenue(venue))
                })
                .catch(next)
    })

venuesRouter
    .route('/:venue_id')
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
    .get((req, res, next) => {
        res.json(serializeVenue(res.venue))
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
    .patch(jsonParser, (req, res, next) => {
        const { venue_name, venue_website, venue_price, venue_rating, venue_capacity, venue_pros, venue_cons } = req.body
        const venueToUpdate = { venue_name, venue_website, venue_price, venue_rating, venue_capacity, venue_pros, venue_cons }

        VenuesService.updateVenue(
            req.app.get('db'),
            req.params.venue_id,
            venueToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = venuesRouter