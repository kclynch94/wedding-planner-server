const path = require('path')
const express = require('express')
const xss = require('xss')
const GuestsService = require('./guests-service')
const {requireAuth} = require('../middleware/jwt-auth')

const guestsRouter = express.Router()
const jsonParser = express.json()

const serializeGuest = guest => {
    return {
        id: guest.id,
        guest_first_name: xss(guest.guest_first_name),
        guest_last_name: xss(guest.guest_last_name),
        guest_type: xss(guest.guest_type),
        guest_plus_one: guest.guest_plus_one,
        guest_address: xss(guest.guest_address),
        user_id: guest.user_id
    }
}

guestsRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
        if(req.user.user_email){
            const knexInstance = req.app.get('db')
            GuestsService.getAllGuests(knexInstance, req.user.id)
                .then(guests => {
                    res.json(guests.map(serializeGuest))
                })
                .catch(next)
        } else {
            return res.status(403).json({error: "not authenticated"})
        }
    })
    .post(jsonParser, (req, res, next) => {
        const { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_address } = req.body
        const newGuest = { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_address, user_id: req.user.id }
        const requiredFields = { guest_first_name, guest_last_name, guest_type, guest_plus_one }

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            GuestsService.insertGuest(
                req.app.get('db'),
                newGuest
            )
                .then(guest => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${guest.id}`))
                        .json(serializeGuest(guest))
                })
                .catch(next)
    })

guestsRouter
    .route('/:guest_id')
    .all((req, res, next) => {
        GuestsService.getById(
            req.app.get('db'),
            req.params.guest_id
        )
            .then(guest => {
                if (!guest) {
                    return res.status(404).json({
                        error: { message: `Guest doesn't exist` }
                    })
                }
                res.guest = guest
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        GuestsService.deleteGuest(
            req.app.get('db'),
            req.params.guest_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_address } = req.body
        const guestToUpdate = { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_address }

        GuestsService.updateGuest(
            req.app.get('db'),
            req.params.guest_id,
            guestToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = guestsRouter