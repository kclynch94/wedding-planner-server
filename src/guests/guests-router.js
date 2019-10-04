const path = require('path')
const express = require('express')
const xss = require('xss')
const GuestsService = require('./guests-service')

const guestsRouter = express.Router()
const jsonParser = express.json()

const serializeGuest = guest => {
    return {
        id: guest.id,
        guest_first_name: xss(guest.guest_first_name),
        guest_last_name: xss(guest.guest_last_name),
        guest_type: xss(guest.guest_type),
        guest_plus_one: guest.guest_plus_one,
        guest_street: xss(guest.guest_street),
        guest_city: xss(guest.guest_city),
        guest_state: xss(guest.guest_state),
        guest_zip: guest.guest_zip,
        user_id: guest.user_id
    }
}

guestsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        GuestsService.getAllGuests(knexInstance)
            .then(guests => {
                res.json(guests.map(serializeGuest))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_street, guest_city, guest_state, guest_zip, user_id } = req.body
        const newGuest = { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_street, guest_city, guest_state, guest_zip, user_id }

        for (const [key, value] of Object.entries(newGuest))
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
    .get((req, res, next) => {
        res.json(serializeGuest(res.guest))
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
        const { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_street, guest_city, guest_state, guest_zip } = req.body
        const guestToUpdate = { guest_first_name, guest_last_name, guest_type, guest_plus_one, guest_street, guest_city, guest_state, guest_zip }

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