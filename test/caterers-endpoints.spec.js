const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Caterers Endpoints', function() {
  let db

  const {
    testUsers,
    testCaterers,
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

  describe(`GET /api/caterers`, () => {
    context(`Given no caterers`, () => {
      it(`responds with 200 and an empty list`, () => { 
        return supertest(app)
          .get('/api/caterers')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, [])
      })
    })

    context('Given there are caterers in the database', () => {
      beforeEach('insert caterers', () =>
        helpers.seedCaterersTables(
          db,
          testUsers,
          testCaterers,
        )
      )

      it('responds with 200 and all of the caterers', () => {
        let expectedCaterers = []
        for(let i = 0; i<testCaterers.length; i++) {
          if (registerUser.id === +testCaterers[i].user_id) {
            expectedCaterers.push(helpers.makeExpectedCaterer(testCaterers[i]))
          } 
        }
        return supertest(app)
          .get('/api/caterers')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedCaterers)
      })
    })

    context(`Given an XSS attack caterer`, () => {
      const testUser = registerUser
      const {
        maliciousCaterer,
        expectedCaterer,
      } = helpers.makeMaliciousCaterer(testUser)

      beforeEach('insert malicious caterer', () => {
        return helpers.seedMaliciousCaterer(
          db,
          maliciousCaterer,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/caterers`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body[0].caterer_name).to.eql(expectedCaterer.caterer_name)
            expect(res.body[0].caterer_website).to.eql(expectedCaterer.caterer_website)
            expect(res.body[0].caterer_type).to.eql(expectedCaterer.caterer_type)
            expect(res.body[0].caterer_pros).to.eql(expectedCaterer.caterer_pros)
            expect(res.body[0].caterer_cons).to.eql(expectedCaterer.caterer_cons)
          })
      })
    })
  })

  describe(`GET /api/caterers/:caterer_id`, () => {
    context(`Given no caterers`, () => {
      beforeEach(() =>
        db.into('users').insert(testUsers)
      )

      it(`responds with 404`, () => {
        const catererId = 123456
        return supertest(app)
          .get(`/api/caterers/${catererId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Caterer doesn't exist`}})
      })
    })

    context('Given there are caterers in the database', () => {
      beforeEach('insert caterers', () =>
        helpers.seedCaterersTables(
          db,
          testUsers,
          testCaterers,
        )
      )

      it('responds with 200 and the specified caterer', () => {
        const catererId = 2
        const expectedCaterer = helpers.makeExpectedCaterer(
          testCaterers[catererId - 1],
        )

        return supertest(app)
          .get(`/api/caterers/${catererId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedCaterer)
      })
    })

    context(`Given an XSS attack caterer`, () => {
      const testUser = registerUser
      const {
        maliciousCaterer,
        expectedCaterer,
      } = helpers.makeMaliciousCaterer(testUser)

      beforeEach('insert malicious caterer', () => {
        return helpers.seedMaliciousCaterer(
          db,
          maliciousCaterer,
        )
      })

      it('removes XSS attack content', () => {
        
        return supertest(app)
          .get(`/api/caterers/${maliciousCaterer.id}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body.caterer_name).to.eql(expectedCaterer.caterer_name)
            expect(res.body.caterer_website).to.eql(expectedCaterer.caterer_website)
            expect(res.body.caterer_type).to.eql(expectedCaterer.caterer_type)
            expect(res.body.caterer_pros).to.eql(expectedCaterer.caterer_pros)
            expect(res.body.caterer_cons).to.eql(expectedCaterer.caterer_cons)
          })
      })
    })
  })

  describe(`POST /api/caterers`, () => {
    ['caterer_name'].forEach(field => {
      const newCaterer = {
        caterer_name: 'test caterer',
      }
    
      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newCaterer[field]

        return supertest(app)
          .post(`/api/caterers`)
          .send(newCaterer)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('adds a new caterer to the store', () => {
      const newCaterer = {
          caterer_name: 'test-caterer',
          user_id: 1,
      }
      return supertest(app)
        .post(`/api/caterers`)
        .send(newCaterer)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.caterer_name).to.eql(newCaterer.caterer_name)
          expect(res.body.user_id).to.eql(newCaterer.user_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/caterers/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/caterers/${res.body.id}`)
            .set({
              token: token,
              user_email: registerUser.user_email
            })
            .expect(res.body)
        )
    })

    it('removes XSS attack content from response', () => {
      const testUser = registerUser
      const {
        maliciousCaterer,
        expectedCaterer,
      } = helpers.makeMaliciousCaterer(testUser)
      return supertest(app)
        .post(`/api/caterers`)
        .send(maliciousCaterer)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.caterer_name).to.eql(expectedCaterer.caterer_name)
          expect(res.body.caterer_website).to.eql(expectedCaterer.caterer_website)
          expect(res.body.caterer_type).to.eql(expectedCaterer.caterer_type)
          expect(res.body.caterer_pros).to.eql(expectedCaterer.caterer_pros)
          expect(res.body.caterer_cons).to.eql(expectedCaterer.caterer_cons)
        })
    })
  })

  describe(`PATCH /api/caterers/:caterer_id`, () => {
    context(`Given no caterers`, () => {
      it(`responds with 404`, () => {
        const catererId = 123456
        return supertest(app)
          .patch(`/api/caterers/${catererId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Caterer doesn't exist` } })
      })
    })

    context('Given there are caterers in the database', () => {

      beforeEach('insert caterers', () =>
        helpers.seedCaterersTables(
          db,
          testUsers,
          testCaterers,
        )
      )

      it('responds with 204 and updates the caterer', () => {
        const idToUpdate = 2
        const updateCaterer = {
          caterer_name: 'updated caterer name',
        }
        const expectedCaterer = {
          ...testCaterers[idToUpdate - 1],
          ...updateCaterer
        }
        return supertest(app)
          .patch(`/api/caterers/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send(updateCaterer)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/caterers/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedCaterer)
          )
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateCaterer = {
          caterer_name: 'updated caterer name',
        }
        const expectedCaterer = {
          ...testCaterers[idToUpdate - 1],
          ...updateCaterer
        }

        return supertest(app)
          .patch(`/api/caterers/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send({
            ...updateCaterer,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/caterers/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedCaterer)
          )
      })
    })
  })
})