const path = require('path')
const express = require('express')
const xss = require('xss')
const FloristsService = require('./florists-service')
const User = require('../models/user.js')
const {requireAuth} = require('../middleware/jwt-auth')

const floristsRouter = express.Router()
const jsonParser = express.json()

const serializeFlorist = florist => {
    return {
        id: florist.id,
        florist_name: xss(florist.florist_name),
        florist_website: xss(florist.florist_website),
        florist_price: florist.florist_price,
        florist_rating: florist.florist_rating,
        florist_pros: [xss(florist.florist_pros)],
        florist_cons: [xss(florist.florist_cons)],
        user_id: florist.user_id
    }
}

floristsRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            FloristsService.getAllFlorists(knexInstance, req.user.id)
                .then(florists => {
                    res.json(florists.map(serializeFlorist))
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { florist_name, user_id } = req.body
        const newFlorist = { florist_name, user_id }

        for (const [key, value] of Object.entries(newFlorist))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            FloristsService.insertFlorist(
                req.app.get('db'),
                newFlorist
            )
                .then(florist => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${florist.id}`))
                        .json(serializeFlorist(florist))
                })
                .catch(next)
    })

floristsRouter
    .route('/:florist_id')
    .all((req, res, next) => {
        FloristsService.getById(
            req.app.get('db'),
            req.params.florist_id
        )
            .then(florist => {
                if (!florist) {
                    return res.status(404).json({
                        error: { message: `Florist doesn't exist` }
                    })
                }
                res.florist = florist
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeFlorist(res.florist))
    })
    .delete((req, res, next) => {
        FloristsService.deleteFlorist(
            req.app.get('db'),
            req.params.florist_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { florist_name, florist_website, florist_price, florist_rating, florist_pros, florist_cons } = req.body
        const floristToUpdate = { florist_name, florist_website, florist_price, florist_rating, florist_pros, florist_cons }

        FloristsService.updateFlorist(
            req.app.get('db'),
            req.params.florist_id,
            floristToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = floristsRouter