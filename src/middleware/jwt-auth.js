const AuthService = require('../auth/auth-service')
const User = require('../models/user')

function requireAuth(req, res, next) {
  const authToken = req.header('token') || ''

  try {
    //const payload = AuthService.verifyJwt(bearerToken)

    return User.authenticate({token: req.header('token'),user_email: req.header('user_email')})
      .then(user => {
        console.log('requireAuth User', user)
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' })

        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch(error) {
      console.log('error', error)
    res.status(401).json({ error: 'Unauthorized request' })
  }
}

module.exports = {
  requireAuth,
}