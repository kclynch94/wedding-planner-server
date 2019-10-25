const path = require('path')
const express = require('express')
const xss = require('xss')
const CaterersService = require('./caterers-service')
const User = require('../models/user.js')
const {requireAuth} = require('../middleware/jwt-auth')

const caterersRouter = express.Router()
const jsonParser = express.json()

const serializeCaterer = caterer => {
    return {
        id: caterer.id,
        caterer_name: xss(caterer.caterer_name),
        caterer_website: xss(caterer.caterer_website),
        caterer_price: caterer.caterer_price,
        caterer_rating: caterer.caterer_rating,
        caterer_type: xss(caterer.caterer_type),
        caterer_pros: [xss(caterer.caterer_pros)],
        caterer_cons: [xss(caterer.caterer_cons)],
        user_id: caterer.user_id
    }
}

caterersRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            CaterersService.getAllCaterers(knexInstance, req.user.id)
                .then(caterers => {
                    res.json(caterers.map(serializeCaterer))
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { caterer_name, caterer_website, caterer_pros, caterer_type, caterer_cons, user_id } = req.body
        const newCaterer = { caterer_name, caterer_website, caterer_pros, caterer_type, caterer_cons, user_id }
        const requiredFields = {caterer_name, user_id }

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            CaterersService.insertCaterer(
                req.app.get('db'),
                newCaterer
            )
                .then(caterer => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${caterer.id}`))
                        .json(serializeCaterer(caterer))
                })
                .catch(next)
    })

caterersRouter
    .route('/:caterer_id')
    .all((req, res, next) => {
        CaterersService.getById(
            req.app.get('db'),
            req.params.caterer_id
        )
            .then(caterer => {
                if (!caterer) {
                    return res.status(404).json({
                        error: { message: `Caterer doesn't exist` }
                    })
                }
                res.caterer = caterer
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCaterer(res.caterer))
    })
    .delete((req, res, next) => {
        CaterersService.deleteCaterer(
            req.app.get('db'),
            req.params.caterer_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { caterer_name, caterer_website, caterer_price, caterer_rating, caterer_type, caterer_pros, caterer_cons } = req.body
        const catererToUpdate = { caterer_name, caterer_website, caterer_price, caterer_rating, caterer_type, caterer_pros, caterer_cons }

        CaterersService.updateCaterer(
            req.app.get('db'),
            req.params.caterer_id,
            catererToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = caterersRouter