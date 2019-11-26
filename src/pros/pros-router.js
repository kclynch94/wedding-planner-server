const path = require('path')
const express = require('express')
const xss = require('xss')
const ProsService = require('./pros-service')
const User = require('../models/user.js')
const {requireAuth} = require('../middleware/jwt-auth')

const prosRouter = express.Router()
const jsonParser = express.json()

const serializePro = pro => {
    return {
        id: pro.id,
        pro_content: xss(pro.pro_content),
        pro_type: pro.pro_type,
        ref_id: pro.ref_id,
        user_id: pro.user_id
    }
}

prosRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            ProsService.getAllPros(knexInstance, req.user.id)
                .then(pros => {
                    res.json(pros.map(serializePro))
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        console.log('req.user', req.user)
        const { pro_content, pro_type, ref_id  } = req.body
        const newPro = { pro_content, pro_type, ref_id }
        const requiredFields = {pro_content, pro_type, ref_id}

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            ProsService.insertPro(
                req.app.get('db'),
                newPro
            )
                .then(pro => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${pro.id}`))
                        .json(serializePro(pro))
                })
                .catch(next)
    })

    prosRouter
    .route('/:pro_id')
    .all((req, res, next) => {
        ProsService.getById(
            req.app.get('db'),
            req.params.pro_id
        )
            .then(pro => {
                if (!pro) {
                    return res.status(404).json({
                        error: { message: `Pro doesn't exist` }
                    })
                }
                res.pro = pro
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializePro(res.pro))
    })
    .delete((req, res, next) => {
        ProsService.deletePro(
            req.app.get('db'),
            req.params.pro_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { pro_content, pro_type, ref_id } = req.body
        const proToUpdate = { pro_content, pro_type, ref_id }

        ProsService.updatePro(
            req.app.get('db'),
            req.params.pro_id,
            proToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = prosRouter

