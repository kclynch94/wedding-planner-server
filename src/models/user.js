const environment     = process.env.NODE_ENV || 'development';    // set environment
const bcrypt          = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto          = require('crypto')                         // built-in encryption node module

const signup = (request, response) => {
    const user = request.body
    const db = request.app.get('db')
    return hashPassword(user.user_password)
      .then((hashedPassword) => {
        delete user.password
        user.password_digest = hashedPassword
      })
      .then(() => createToken())
      .then(token => user.token = token)
      .then(() => createUser(db, user))
      .then(user => {
        if(user.severity === "ERROR") {
          response.status(400).json(user)
        } else {
          delete user.password_digest
          response.status(201).json({ user })
        }
      })
      .catch((err) => console.error(err))
  }

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    if(password) {
      return bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    } else {
      return reject('err: missing password')
    }   
  })
}

// user will be saved to db - we're explicitly asking postgres to return back helpful info from the row created
const createUser = (db, user) => {
  return db.raw(
    "INSERT INTO users (user_email, user_password_digest, user_token, user_created_at, user_first_name, user_last_name) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, user_email, user_created_at, user_token, user_first_name, user_last_name",
    [user.user_email, user.password_digest, user.token, new Date(), user.user_first_name, user.user_last_name]
  )
  .then((data) => data.rows[0])
  .catch(error => error)
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
    const db = request.app.get('db')
    return findUser(db, userReq)
      .then(foundUser => {
        if (foundUser) {
          user = foundUser
          return checkPassword(userReq.user_password, foundUser)
        } else {
          return response.status(400).json({error: 'Incorrect user_email or user_password'})
        }
      })
      .then((res) => {
        return createToken()
      })
      .then(token => updateUserToken(db, token, user))
      .then((updatedUser) => {
        delete updatedUser
        return response.status(200).json(updatedUser)
      })
      .catch((err) => {
        console.error(err)
        return response.status(400).json({error: 'Incorrect user_email or user_password'})
      })
  }

const findUser = (db, userReq) => {
  return db.raw("SELECT * FROM users WHERE user_email = ?", [userReq.user_email])
    .then((data) => data.rows[0])
}

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) =>{
    return (
        bcrypt.compare(reqPassword, foundUser.user_password_digest, (err, response) => {
        if (err) {
          return reject(err)
        }
        else if (response) {
          return resolve(response)
        } else {
          return reject(new Error('Passwords do not match.'))
        }
    })
    )
  })
}

const updateUserToken = (db, token, user) => {
  if (user && user.id){
    return db.raw("UPDATE users SET user_token = ? WHERE id = ? RETURNING id, user_email, user_token", [token, user.id])
      .then((data) => data.rows[0])
  }else{
    return{}
  }
}

const authenticate = (db, userReq) => {
    return (findByToken(db, userReq.token)
      .then((user) => {
        if (user && (user.user_email == userReq.user_email)) {
          return user
        } else {
          return {}
        }
      }))
  }
  
const findByToken = (db, token) => {
    return db.raw("SELECT * FROM users WHERE user_token = ?", [token])
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