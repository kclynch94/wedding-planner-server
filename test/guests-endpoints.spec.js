const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Guests Endpoints', function() {
  let db

  const {
    testUsers,
    testGuests,
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

  describe(`GET /api/guests`, () => {
    context(`Given no guests`, () => {
      it(`responds with 200 and an empty list`, () => { 
        return supertest(app)
          .get('/api/guests')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, [])
      })
    })

    context('Given there are guests in the database', () => {
      beforeEach('insert guests', () =>
        helpers.seedGuestsTables(
          db,
          testUsers,
          testGuests,
        )
      )

      it('responds with 200 and all of the guests', () => {
        let expectedGuests = []
        for(let i = 0; i<testGuests.length; i++) {
          if (registerUser.id === +testGuests[i].user_id) {
            expectedGuests.push(helpers.makeExpectedGuest(testGuests[i]))
          } 
        }
        return supertest(app)
          .get('/api/guests')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedGuests)
      })
    })

    context(`Given an XSS attack guest`, () => {
      const testUser = registerUser
      const {
        maliciousGuest,
        expectedGuest,
      } = helpers.makeMaliciousGuest(testUser)

      beforeEach('insert malicious guest', () => {
        return helpers.seedMaliciousGuest(
          db,
          maliciousGuest,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/guests`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body[0].guest_first_name).to.eql(expectedGuest.guest_first_name)
            expect(res.body[0].guest_last_name).to.eql(expectedGuest.guest_last_name)
            expect(res.body[0].guest_type).to.eql(expectedGuest.guest_type)
            expect(res.body[0].guest_plus_one).to.eql(expectedGuest.guest_plus_one)
            expect(res.body[0].user_id).to.eql(expectedGuest.user_id)
          })
      })
    })
  })

  describe(`POST /api/guests`, () => {
    ['guest_first_name', 'guest_last_name', 'guest_type', 'guest_plus_one'].forEach(field => {
      const newGuest = {
        guest_first_name: 'test',
        guest_last_name: 'guest',
        guest_type: 'Out of town',
        guest_plus_one: 'Yes',
      }
    
      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newGuest[field]

        return supertest(app)
          .post(`/api/guests`)
          .send(newGuest)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('adds a new guest to the store', () => {
        const newGuest = {
            guest_first_name: 'test',
            guest_last_name: 'guest',
            guest_type: 'Out of town',
            guest_plus_one: 'Yes',
            user_id: 1,
          }
      return supertest(app)
        .post(`/api/guests`)
        .send(newGuest)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.guest_first_name).to.eql(newGuest.guest_first_name)
          expect(res.body.guest_last_name).to.eql(newGuest.guest_last_name)
          expect(res.body.guest_type).to.eql(newGuest.guest_type)
          expect(res.body.guest_plus_one).to.eql(newGuest.guest_plus_one)
          expect(res.body.user_id).to.eql(newGuest.user_id)
          expect(res.body).to.have.property('id')
        })
    })

    it('removes XSS attack content from response', () => {
      const testUser = registerUser
      const {
        maliciousGuest,
        expectedGuest,
      } = helpers.makeMaliciousGuest(testUser)
      return supertest(app)
        .post(`/api/guests`)
        .send(maliciousGuest)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
            expect(res.body.guest_first_name).to.eql(expectedGuest.guest_first_name)
            expect(res.body.guest_last_name).to.eql(expectedGuest.guest_last_name)
            expect(res.body.guest_type).to.eql(expectedGuest.guest_type)
            expect(res.body.guest_plus_one).to.eql(expectedGuest.guest_plus_one)
            expect(res.body.user_id).to.eql(expectedGuest.user_id)
        })
    })
  })

  describe(`PATCH /api/guests/:guest_id`, () => {
    context(`Given no guests`, () => {
      it(`responds with 404`, () => {
        const guestId = 123456
        return supertest(app)
          .patch(`/api/guests/${guestId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Guest doesn't exist` } })
      })
    })

    context('Given there are guests in the database', () => {

      beforeEach('insert guests', () =>
        helpers.seedGuestsTables(
          db,
          testUsers,
          testGuests,
        )
      )

      it('responds with 204 and updates the guest', () => {
        const idToUpdate = 2
        const updateGuest = {
          guest_first_name: 'updated guest name',
        }
        const expectedGuest = {
          ...testGuests[idToUpdate - 1],
          ...updateGuest
        }
        return supertest(app)
          .patch(`/api/guests/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send(updateGuest)
          .expect(204)
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateGuest = {
          guest_first_name: 'updated guest name',
        }
        const expectedGuest = {
          ...testGuests[idToUpdate - 1],
          ...updateGuest
        }

        return supertest(app)
          .patch(`/api/guests/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send({
            ...updateGuest,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
      })
    })
  })
})