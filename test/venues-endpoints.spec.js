const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Venues Endpoints', function() {
  let db

  const {
    testUsers,
    testVenues,
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

  describe(`GET /api/venues`, () => {
    context(`Given no venues`, () => {
      it(`responds with 200 and an empty list`, () => { 
        return supertest(app)
          .get('/api/venues')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, [])
      })
    })

    context('Given there are venues in the database', () => {
      beforeEach('insert venues', () =>
        helpers.seedVenuesTables(
          db,
          testUsers,
          testVenues,
        )
      )

      it('responds with 200 and all of the venues', () => {
        let expectedVenues = []
        for(let i = 0; i<testVenues.length; i++) {
          if (registerUser.id === +testVenues[i].user_id) {
            expectedVenues.push(helpers.makeExpectedVenue(testVenues[i]))
          } 
        }
        return supertest(app)
          .get('/api/venues')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedVenues)
      })
    })

    context(`Given an XSS attack venue`, () => {
      const testUser = registerUser
      const {
        maliciousVenue,
        expectedVenue,
      } = helpers.makeMaliciousVenue(testUser)

      beforeEach('insert malicious venue', () => {
        return helpers.seedMaliciousVenue(
          db,
          maliciousVenue,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/venues`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body[0].venue_name).to.eql(expectedVenue.venue_name)
            expect(res.body[0].venue_website).to.eql(expectedVenue.venue_website)
            expect(res.body[0].venue_pros).to.eql(expectedVenue.venue_pros)
            expect(res.body[0].venue_cons).to.eql(expectedVenue.venue_cons)
          })
      })
    })
  })

  describe(`GET /api/venues/:venue_id`, () => {
    context(`Given no venues`, () => {
      beforeEach(() =>
        db.into('users').insert(testUsers)
      )

      it(`responds with 404`, () => {
        const venueId = 123456
        return supertest(app)
          .get(`/api/venues/${venueId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Venue doesn't exist`}})
      })
    })

    context('Given there are venues in the database', () => {
      beforeEach('insert venues', () =>
        helpers.seedVenuesTables(
          db,
          testUsers,
          testVenues,
        )
      )

      it('responds with 200 and the specified venue', () => {
        const venueId = 2
        const expectedVenue = helpers.makeExpectedVenue(
          testVenues[venueId - 1],
        )

        return supertest(app)
          .get(`/api/venues/${venueId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedVenue)
      })
    })

    context(`Given an XSS attack venue`, () => {
      const testUser = registerUser
      const {
        maliciousVenue,
        expectedVenue,
      } = helpers.makeMaliciousVenue(testUser)

      beforeEach('insert malicious venue', () => {
        return helpers.seedMaliciousVenue(
          db,
          maliciousVenue,
        )
      })

      it('removes XSS attack content', () => {
        
        return supertest(app)
          .get(`/api/venues/${maliciousVenue.id}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body.venue_name).to.eql(expectedVenue.venue_name)
            expect(res.body.venue_website).to.eql(expectedVenue.venue_website)
            expect(res.body.venue_pros).to.eql(expectedVenue.venue_pros)
            expect(res.body.venue_cons).to.eql(expectedVenue.venue_cons)
          })
      })
    })
  })

  describe(`POST /api/venues`, () => {
    ['venue_name'].forEach(field => {
      const newVenue = {
        venue_name: 'test venue',
      }
    
      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newVenue[field]

        return supertest(app)
          .post(`/api/venues`)
          .send(newVenue)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('adds a new venue to the store', () => {
      const newVenue = {
          venue_name: 'test-venue',
          user_id: 1,
      }
      return supertest(app)
        .post(`/api/venues`)
        .send(newVenue)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.venue_name).to.eql(newVenue.venue_name)
          expect(res.body.user_id).to.eql(newVenue.user_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/venues/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/venues/${res.body.id}`)
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
        maliciousVenue,
        expectedVenue,
      } = helpers.makeMaliciousVenue(testUser)
      return supertest(app)
        .post(`/api/venues`)
        .send(maliciousVenue)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.venue_name).to.eql(expectedVenue.venue_name)
          expect(res.body.venue_website).to.eql(expectedVenue.venue_website)
          expect(res.body.venue_pros).to.eql(expectedVenue.venue_pros)
          expect(res.body.venue_cons).to.eql(expectedVenue.venue_cons)
        })
    })
  })

  describe(`PATCH /api/venues/:venue_id`, () => {
    context(`Given no venues`, () => {
      it(`responds with 404`, () => {
        const venueId = 123456
        return supertest(app)
          .patch(`/api/venues/${venueId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Venue doesn't exist` } })
      })
    })

    context('Given there are venues in the database', () => {

      beforeEach('insert venues', () =>
        helpers.seedVenuesTables(
          db,
          testUsers,
          testVenues,
        )
      )

      it('responds with 204 and updates the venue', () => {
        const idToUpdate = 2
        const updateVenue = {
          venue_name: 'updated venue name',
        }
        const expectedVenue = {
          ...testVenues[idToUpdate - 1],
          ...updateVenue
        }
        return supertest(app)
          .patch(`/api/venues/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send(updateVenue)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/venues/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedVenue)
          )
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateVenue = {
          venue_name: 'updated venue name',
        }
        const expectedVenue = {
          ...testVenues[idToUpdate - 1],
          ...updateVenue
        }

        return supertest(app)
          .patch(`/api/venues/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send({
            ...updateVenue,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/venues/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedVenue)
          )
      })
    })
  })
})