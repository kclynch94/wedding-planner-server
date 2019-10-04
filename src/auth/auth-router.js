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
    })

authRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        User.signin(req, res)
    })
    
module.exports = authRouter