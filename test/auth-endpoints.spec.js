const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', function() {
  let db

  const { testUsers } = helpers.makeFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/auth/signup`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsersTables(
          db,
          testUsers,
        )
      )

      const requiredFields = ['user_first_name', 'user_last_name', 'user_password', 'user_email']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_first_name: 'test',
          user_last_name: 'user',
          user_email: 'testinguser@gmail.com',
          user_password: 'password1234',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/auth/signup')
            .send(registerAttemptBody)
            .expect(400, {
              error: {message: `Missing '${field}' in request body`},
            })
        })
      })

      it(`responds 400 'User email already taken' when user_email isn't unique`, () => {
        const duplicateUser = {
          user_first_name: testUser.user_first_name,
          user_last_name: testUser.user_last_name,
          user_password: '11AAaa!!',
          user_email: testUser.user_email,
        }
        return supertest(app)
          .post('/api/auth/signup')
          .send(duplicateUser)
          .expect(400)
          .expect(res=> {
            expect(res.body.detail).to.eql(`Key (user_email)=(${duplicateUser.user_email}) already exists.`)
          })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_first_name: 'test',
          user_last_name: 'user',
          user_password: 'password1234',
          user_email: 'testuser5@gmail.com',
        }
        return supertest(app)
          .post('/api/auth/signup')
          .send(newUser)
          .expect(201)
          .expect(res => {           
            expect(res.body.user).to.have.property('id')
            expect(res.body.user.user_first_name).to.eql(newUser.user_first_name)
            expect(res.body.user.user_last_name).to.eql(newUser.user_last_name)
            expect(res.body.user.user_email).to.eql(newUser.user_email)
            expect(res.body.user).to.not.have.property('user_password')
            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
            const actualDate = new Date(res.body.user.user_created_at).toLocaleString('en', { timeZone: 'UTC' })
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.user.id })
              .first()
              .then(row => {
                expect(row.user_first_name).to.eql(newUser.user_first_name)
                expect(row.user_last_name).to.eql(newUser.user_last_name)
                expect(row.user_email).to.eql(newUser.user_email)
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.user_created_at).toLocaleString('en', { timeZone: 'UTC' })
                expect(actualDate).to.eql(expectedDate)
                return bcrypt.compare(newUser.user_password, row.user_password_digest)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsersTables(
        db,
        testUsers,
      )
    )

    const requiredFields = ['user_email', 'user_password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_email: testUser.user_email,
        user_password: testUser.user_password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: {message: `Missing '${field}' in request body`},
          })
      })
    })

    it(`responds 400 'invalid user_email or user_password' when bad user_email`, () => {
      const userInvalidUser = { user_email: 'user-not', user_password: 'existy' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect user_email or user_password` })
    })

    it(`responds 400 'invalid user_email or user_password' when bad user_password`, () => {
      const userInvalidPass = { user_email: testUser.user_email, user_password: 'incorrect' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect user_email or user_password` })
    })
  })
})