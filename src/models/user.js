const environment     = process.env.NODE_ENV || 'development';    // set environment
const { DB_URL } = require('../config')

// //const db = knex({
//     client: 'pg',
//     connection: DB_URL,
// })
//const configuration   = require('../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')({
    client: 'pg',
    connection: DB_URL,
});           // define database based on above
const bcrypt          = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto          = require('crypto')                         // built-in encryption node module

const signup = (request, response) => {
    const user = request.body
    console.log(request.body)
    hashPassword(user.user_password)
      .then((hashedPassword) => {
        delete user.password
        user.password_digest = hashedPassword
      })
      .then(() => createToken())
      .then(token => user.token = token)
      .then(() => createUser(user))
      .then(user => {
        delete user.password_digest
        response.status(201).json({ user })
      })
      .catch((err) => console.error(err))
  }

const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

// user will be saved to db - we're explicitly asking postgres to return back helpful info from the row created
const createUser = (user) => {
    console.log(user)
  return database.raw(
    "INSERT INTO users (user_email, user_password_digest, user_token, user_created_at, user_first_name, user_last_name) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, user_email, user_created_at, user_token, user_first_name, user_last_name",
    [user.user_email, user.password_digest, user.token, new Date(), user.user_first_name, user.user_last_name]
  )
  .then((data) => data.rows[0])
}

// crypto ships with node - we're leveraging it to create a random, secure token
const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'))
    })
  })
}

const signin = (request, response) => {
    const userReq = request.body
    let user
  
    findUser(userReq)
      .then(foundUser => {
        user = foundUser
        return checkPassword(userReq.user_password, foundUser)
      })
      .then((res) => createToken())
      .then(token => updateUserToken(token, user))
      .then((updatedUser) => {
        delete updatedUser
        response.status(200).json(updatedUser)
      })
      .catch((err) => console.error(err))
  }

const findUser = (userReq) => {
  return database.raw("SELECT * FROM users WHERE user_email = ?", [userReq.user_email])
    .then((data) => data.rows[0])
}

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) =>{
    return (
        bcrypt.compare(reqPassword, foundUser.user_password_digest, (err, response) => {
        if (err) {
          reject(err)
        }
        else if (response) {
          resolve(response)
        } else {
          reject(new Error('Passwords do not match.'))
        }
    })
    )
  })
}

const updateUserToken = (token, user) => {
  return database.raw("UPDATE users SET user_token = ? WHERE id = ? RETURNING id, user_email, user_token", [token, user.id])
    .then((data) => data.rows[0])
}

const authenticate = (userReq) => {
    return (findByToken(userReq.token)
      .then((user) => {
        if (user && (user.user_email == userReq.user_email)) {
            console.log("user authenticate true")
          return user
        } else {
            console.log("user authenticate false")
          return {}
        }
      }))
  }
  
const findByToken = (token) => {
    return database.raw("SELECT * FROM users WHERE user_token = ?", [token])
      .then((data) => {
        return data.rows[0]
      })
}
  
  // don't forget to export!
  module.exports = {
    signup, 
    signin,
    authenticate, 
    findByToken
  }