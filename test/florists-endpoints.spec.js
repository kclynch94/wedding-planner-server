const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Florists Endpoints', function() {
  let db

  const {
    testUsers,
    testFlorists,
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

  describe(`GET /api/florists`, () => {
    context(`Given no florists`, () => {
      it(`responds with 200 and an empty list`, () => { 
        return supertest(app)
          .get('/api/florists')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, [])
      })
    })

    context('Given there are florists in the database', () => {
      beforeEach('insert florists', () =>
        helpers.seedFloristsTables(
          db,
          testUsers,
          testFlorists,
        )
      )

      it('responds with 200 and all of the florists', () => {
        let expectedFlorists = []
        for(let i = 0; i<testFlorists.length; i++) {
          if (registerUser.id === +testFlorists[i].user_id) {
            expectedFlorists.push(helpers.makeExpectedFlorist(testFlorists[i]))
          } 
        }
        return supertest(app)
          .get('/api/florists')
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedFlorists)
      })
    })

    context(`Given an XSS attack florist`, () => {
      const testUser = registerUser
      const {
        maliciousFlorist,
        expectedFlorist,
      } = helpers.makeMaliciousFlorist(testUser)

      beforeEach('insert malicious florist', () => {
        return helpers.seedMaliciousFlorist(
          db,
          maliciousFlorist,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/florists`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body[0].florist_name).to.eql(expectedFlorist.florist_name)
            expect(res.body[0].florist_website).to.eql(expectedFlorist.florist_website)
            expect(res.body[0].florist_pros).to.eql(expectedFlorist.florist_pros)
            expect(res.body[0].florist_cons).to.eql(expectedFlorist.florist_cons)
          })
      })
    })
  })

  describe(`GET /api/florists/:florist_id`, () => {
    context(`Given no florists`, () => {
      beforeEach(() =>
        db.into('users').insert(testUsers)
      )

      it(`responds with 404`, () => {
        const floristId = 123456
        return supertest(app)
          .get(`/api/florists/${floristId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Florist doesn't exist`}})
      })
    })

    context('Given there are florists in the database', () => {
      beforeEach('insert florists', () =>
        helpers.seedFloristsTables(
          db,
          testUsers,
          testFlorists,
        )
      )

      it('responds with 200 and the specified florist', () => {
        const floristId = 2
        const expectedFlorist = helpers.makeExpectedFlorist(
          testFlorists[floristId - 1],
        )

        return supertest(app)
          .get(`/api/florists/${floristId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200, expectedFlorist)
      })
    })

    context(`Given an XSS attack florist`, () => {
      const testUser = registerUser
      const {
        maliciousFlorist,
        expectedFlorist,
      } = helpers.makeMaliciousFlorist(testUser)

      beforeEach('insert malicious florist', () => {
        return helpers.seedMaliciousFlorist(
          db,
          maliciousFlorist,
        )
      })

      it('removes XSS attack content', () => {
        
        return supertest(app)
          .get(`/api/florists/${maliciousFlorist.id}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(200)
          .expect(res => {
            expect(res.body.florist_name).to.eql(expectedFlorist.florist_name)
            expect(res.body.florist_website).to.eql(expectedFlorist.florist_website)
            expect(res.body.florist_pros).to.eql(expectedFlorist.florist_pros)
            expect(res.body.florist_cons).to.eql(expectedFlorist.florist_cons)
          })
      })
    })
  })

  describe(`POST /api/florists`, () => {
    ['florist_name', 'user_id'].forEach(field => {
      const newFlorist = {
        florist_name: 'test florist',
        user_id: 1,
      }
    
      it(`responds with 400 missing '${field}' if not supplied`, () => {
        delete newFlorist[field]

        return supertest(app)
          .post(`/api/florists`)
          .send(newFlorist)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('adds a new florist to the store', () => {
      const newFlorist = {
          florist_name: 'test-florist',
          user_id: 1,
      }
      return supertest(app)
        .post(`/api/florists`)
        .send(newFlorist)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.florist_name).to.eql(newFlorist.florist_name)
          expect(res.body.user_id).to.eql(newFlorist.user_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/florists/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/florists/${res.body.id}`)
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
        maliciousFlorist,
        expectedFlorist,
      } = helpers.makeMaliciousFlorist(testUser)
      console.log('malisiousFlorist', maliciousFlorist)
      return supertest(app)
        .post(`/api/florists`)
        .send(maliciousFlorist)
        .set({
          token: token,
          user_email: registerUser.user_email
        })
        .expect(201)
        .expect(res => {
          expect(res.body.florist_name).to.eql(expectedFlorist.florist_name)
          expect(res.body.florist_website).to.eql(expectedFlorist.florist_website)
          expect(res.body.florist_pros).to.eql(expectedFlorist.florist_pros)
          expect(res.body.florist_cons).to.eql(expectedFlorist.florist_cons)
        })
    })
  })

  describe(`PATCH /api/florists/:florist_id`, () => {
    context(`Given no florists`, () => {
      it(`responds with 404`, () => {
        const floristId = 123456
        return supertest(app)
          .patch(`/api/florists/${floristId}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .expect(404, { error: { message: `Florist doesn't exist` } })
      })
    })

    context('Given there are florists in the database', () => {

      beforeEach('insert florists', () =>
        helpers.seedFloristsTables(
          db,
          testUsers,
          testFlorists,
        )
      )

      it('responds with 204 and updates the florist', () => {
        const idToUpdate = 2
        const updateFlorist = {
          florist_name: 'updated florist name',
        }
        const expectedFlorist = {
          ...testFlorists[idToUpdate - 1],
          ...updateFlorist
        }
        return supertest(app)
          .patch(`/api/florists/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send(updateFlorist)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/florists/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedFlorist)
          )
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateFlorist = {
          florist_name: 'updated florist name',
        }
        const expectedFlorist = {
          ...testFlorists[idToUpdate - 1],
          ...updateFlorist
        }

        return supertest(app)
          .patch(`/api/florists/${idToUpdate}`)
          .set({
            token: token,
            user_email: registerUser.user_email
          })
          .send({
            ...updateFlorist,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/florists/${idToUpdate}`)
              .set({
                token: token,
                user_email: registerUser.user_email
              })
              .expect(expectedFlorist)
          )
      })
    })
  })
})