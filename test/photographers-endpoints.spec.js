const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Photographers Endpoints', function() {
  let db

  const {
    testUsers,
    testPhotographers,
  } = helpers.makeFixtures()

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

  const registerUser = {
    id: 1,
    user_first_name: 'Test 1',
    user_last_name: 'User',
    user_email: 'test1@gmail.com',
    user_password: 'password1234',
    user_created_at: new Date('2029-01-22T16:28:32.615Z'),
    user_token: 'secretToken1234',
  }
  let token = null
  beforeEach('register user', (done) => {
    supertest(app)
        .post('/api/auth/signup')
        .set('content-type', 'application/json')
        .send({
          user_first_name: registerUser.user_first_name,
          user_last_name: registerUser.user_last_name,
          user_email: registerUser.user_email,
          user_password: registerUser.user_password
        })
        .end((err, response) => {
          token = response.body.user.user_token
          done()
        })
  })

  describe(`GET /api/photographers`, () => {
    context(`Given no photographers`, () => {
      it(`responds with 200 and an empty list`, () => { 
        return supertest(app)
          .get('/api/photographers')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, [])
      })
    })

    context('Given there are photographers in the database', () => {
      beforeEach('insert photographers', () =>
        helpers.seedPhotographersTables(
          db,
          testUsers,
          testPhotographers,
        )
      )

      it('responds with 200 and all of the photographers', () => {
        let expectedPhotographers = []
        for(let i = 0; i<testPhotographers.length; i++) {
          if (registerUser.id === +testPhotographers[i].user_id) {
            expectedPhotographers.push(helpers.makeExpectedPhotographer(testPhotographers[i]))
          } 
        }
        return supertest(app)
          .get('/api/photographers')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedPhotographers)
      })
    })

    context(`Given an XSS attack photographer`, () => {
      const testUser = registerUser
      const {
        maliciousPhotographer,
        expectedPhotographer,
      } = helpers.makeMaliciousPhotographer(testUser)

      beforeEach('insert malicious photographer', () => {
        return helpers.seedMaliciousPhotographer(
          db,
          maliciousPhotographer,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/photographers`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body[0].photographer_name).to.eql(expectedPhotographer.photographer_name)
            expect(res.body[0].photographer_website).to.eql(expectedPhotographer.photographer_website)
            expect(res.body[0].photographer_pros).to.eql(expectedPhotographer.photographer_pros)
            expect(res.body[0].photographer_cons).to.eql(expectedPhotographer.photographer_cons)
          })
      })
    })
  })

  describe(`POST /api/photographers`, () => {
    ['photographer_name'].forEach(field => {
      const newPhotographer = {
        photographer_name: 'test photographer',
      }
    
      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newPhotographer[field]

        return supertest(app)
          .post(`/api/photographers`)
          .send(newPhotographer)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('adds a new photographer to the store', () => {
      const newPhotographer = {
          photographer_name: 'test-photographer',
          user_id: 1,
      }
      return supertest(app)
        .post(`/api/photographers`)
        .send(newPhotographer)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.photographer_name).to.eql(newPhotographer.photographer_name)
          expect(res.body.user_id).to.eql(newPhotographer.user_id)
          expect(res.body).to.have.property('id')
        })
    })

    it('removes XSS attack content from response', () => {
      const testUser = registerUser
      const {
        maliciousPhotographer,
        expectedPhotographer,
      } = helpers.makeMaliciousPhotographer(testUser)
      return supertest(app)
        .post(`/api/photographers`)
        .send(maliciousPhotographer)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.photographer_name).to.eql(expectedPhotographer.photographer_name)
          expect(res.body.photographer_website).to.eql(expectedPhotographer.photographer_website)
          expect(res.body.photographer_pros).to.eql(expectedPhotographer.photographer_pros)
          expect(res.body.photographer_cons).to.eql(expectedPhotographer.photographer_cons)
        })
    })
  })

  describe(`PATCH /api/photographers/:photographer_id`, () => {
    context(`Given no photographers`, () => {
      it (`responds with 404`, () => {
        const photographerId = 123456
        return supertest(app)
          .patch(`/api/photographers/${photographerId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Photographer doesn't exist` } })
      })
    })

    context('Given there are photographers in the database', () => {

      beforeEach('insert photographers', () =>
        helpers.seedPhotographersTables(
          db,
          testUsers,
          testPhotographers,
        )
      )

      it('responds with 204 and updates the photographer', () => {
        const idToUpdate = 2
        const updatePhotographer = {
          photographer_name: 'updated photographer name',
        }
        const expectedPhotographer = {
          ...testPhotographers[idToUpdate - 1],
          ...updatePhotographer
        }
        return supertest(app)
          .patch(`/api/photographers/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send(updatePhotographer)
          .expect(204)
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updatePhotographer = {
          photographer_name: 'updated photographer name',
        }
        const expectedPhotographer = {
          ...testPhotographers[idToUpdate - 1],
          ...updatePhotographer
        }

        return supertest(app)
          .patch(`/api/photographers/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send({
            ...updatePhotographer,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
      })
    })
  })
})