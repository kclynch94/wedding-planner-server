const path = require('path')
const express = require('express')
const xss = require('xss')
const PhotographersService = require('./photographers-service')
const User = require('../models/user.js')
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
        photographer_pros: xss(photographer.photographer_pros),
        photographer_cons: xss(photographer.photographer_cons),
        user_id: photographer.user_id
    }
}

photographersRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            PhotographersService.getAllPhotographers(knexInstance, req.user.id)
                .then(photographers => {
                    res.json(photographers.map(serializePhotographer))
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { photographer_name, photographer_website, photographer_price, photographer_rating, photographer_pros, photographer_cons, user_id } = req.body
        const newPhotographer = { photographer_name, photographer_website, photographer_price, photographer_rating, photographer_pros, photographer_cons, user_id }

        for (const [key, value] of Object.entries(newPhotographer))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            PhotographersService.insertPhotographer(
                req.app.get('db'),
                newPhotographer
            )
                .then(photographer => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${photographer.id}`))
                        .json(serializePhotographer(photographer))
                })
                .catch(next)
    })

photographersRouter
    .route('/:photographer_id')
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
    .get((req, res, next) => {
        res.json(serializePhotographer(res.photographer))
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
    .patch(jsonParser, (req, res, next) => {
        const { photographer_name, photographer_website, photographer_price, photographer_rating, photographer_pros, photographer_cons } = req.body
        const photographerToUpdate = { photographer_name, photographer_website, photographer_price, photographer_rating, photographer_pros, photographer_cons }

        PhotographersService.updatePhotographer(
            req.app.get('db'),
            req.params.photographer_id,
            photographerToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = photographersRouter