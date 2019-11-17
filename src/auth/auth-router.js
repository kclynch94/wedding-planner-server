const path = require('path')
const express = require('express')
const xss = require('xss')
const User = require('../models/user')

const authRouter = express.Router()
const jsonParser = express.json()
 

authRouter
    .route('/signup')
    .post(jsonParser, (req, res, next) => {
        const { user_first_name, user_last_name, user_password, user_email } = req.body
        const requiredFields = { user_first_name, user_last_name, user_password, user_email }

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        return User.signup(req, res)
        .catch(error => {
            res.status(400).json(error)
        })
    })

authRouter
    .route('/login')
    .post(jsonParser, (req, res) => {
        const { user_password, user_email } = req.body
        const requiredFields = {user_password, user_email }

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }
        return User.signin(req, res)
        .catch(error => {
            res.status(400).json(error)
        })
    })
    
module.exports = authRouter