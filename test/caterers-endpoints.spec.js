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

  describe(`GET /api/caterers`, () => {
    context(`Given no caterers`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/caterers')
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
        const expectedCaterers = testCaterers.map(caterer =>
          helpers.makeExpectedCaterer(
            testUsers,
            caterer,
          )
        )
        return supertest(app)
          .get('/api/caterers')
          .expect(200, expectedCaterers)
      })
    })

    context(`Given an XSS attack caterer`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousCaterer,
        expectedCaterer,
      } = helpers.makeMaliciousCaterer(testUser)

      beforeEach('insert malicious caterer', () => {
        return helpers.seedMaliciousCaterer(
          db,
          testUser,
          maliciousCaterer,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/caterers`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].caterer_name).to.eql(expectedCaterer.caterer_name)
            expect(res.body[0].caterer_website).to.eql(expectedCaterer.caterer_website)
            expect(res.body[0].caterer_type).to.eql(expectedCaterer.caterer_type)
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
          .set('Authorization', '1234')
          .set({
            token: testUsers[0].user_token,
            user_email: testUsers[0].user_email
          })
          .expect(404, { error: `Caterer doesn't exist` })
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
          testUsers,
          testCaterers[catererId - 1],
        )

        return supertest(app)
          .get(`/api/caterers/${catererId}`)
          .set({
            token: testUsers[0].user_token,
            user_email: testUsers[0].user_email
          })
          .expect(200, expectedCaterer)
      })
    })

    context(`Given an XSS attack caterer`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousCaterer,
        expectedCaterer,
      } = helpers.makeMaliciousCaterer(testUser)

      beforeEach('insert malicious caterer', () => {
        return helpers.seedMaliciousCaterer(
          db,
          testUser,
          maliciousCaterer,
        )
      })

      it('removes XSS attack content', () => {
        
        return supertest(app)
          .get(`/api/caterers/${maliciousCaterer.id}`)
          .set({
            token: testUsers[0].user_token,
            user_email: testUsers[0].user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body.caterer_name).to.eql(expectedCaterer.caterer_name)
            expect(res.body.caterer_website).to.eql(expectedCaterer.caterer_website)
            expect(res.body.caterer_type).to.eql(expectedCaterer.caterer_type)
          })
      })
    })
  })
})