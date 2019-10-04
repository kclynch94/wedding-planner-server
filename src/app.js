require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const logger = require('./logger')
const usersRouter = require('./users/users-router')
const venuesRouter = require('./venues/venues-router')
const photographersRouter = require('./photographers/photographers-router')
const guestsRouter = require('./guests/guests-router')
const caterersRouter = require('./caterers/caterers-router')
const floristsRouter = require('./florists/florists-router')
const User = require('./models/user.js')
const authRouter = require('./auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use('/api/users', usersRouter)
app.use('/api/venues', venuesRouter)
app.use('/api/photographers', photographersRouter)
app.use('/api/guests', guestsRouter)
app.use('/api/caterers', caterersRouter)
app.use('/api/florists', floristsRouter)
app.use('/api/auth', authRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app