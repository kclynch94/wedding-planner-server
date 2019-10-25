const path = require('path')
const express = require('express')
const xss = require('xss')
const User = require('../models/user')

const authRouter = express.Router()
const jsonParser = express.json()
 

authRouter
    .route('/signup')
    .post(jsonParser, (req, res, next) => {
        User.signup(req, res)
        .catch(error => {
            res.json(error)
        })
    })

authRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        return User.signin(req, res)
        .catch(error => {
            res.json(error)
        })
    })
    
module.exports = authRouter