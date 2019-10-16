function makeUsersArray() {
    return [
      {
        id: 1,
        user_first_name: 'Test 1',
        user_last_name: 'User',
        user_email: 'test1@gmail.com',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),
        user_token: 'secretToken1234',
      },
      {
        id: 2,
        user_first_name: 'Test 2',
        user_last_name: 'User',
        user_email: 'test2@gmail.com',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),
        user_token: 'secretToken1234',
      },
      {
        id: 3,
        user_first_name: 'Test 3',
        user_last_name: 'User',
        user_email: 'test3@gmail.com',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),
        user_token: 'secretToken1234',
      },
      {
        id: 4,
        user_first_name: 'Test 4',
        user_last_name: 'User',
        user_email: 'test4@gmail.com',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),
        user_token: 'secretToken1234',
      },
    ]
  }
  
  function makeCaterersArray(users) {
    return [
      {
        id: 1,
        caterer_name: 'Caterer 1',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_type: 'Italian',
        caterer_rating: '3',
        caterer_pros: ['good 1','good 2'],
        caterer_cons: ['bad 1'],
        user_id: users[0].id, 
      },
      {
        id: 2,
        caterer_name: 'Caterer 2',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_type: 'Italian',
        caterer_rating: '3',
        caterer_pros: ['good 1','good 2'],
        caterer_cons: ['bad 1'],
        user_id: users[1].id,  
      },
      {
        id: 3,
        caterer_name: 'Caterer 3',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_type: 'Italian',
        caterer_rating: '3',
        caterer_pros: ['good 1','good 2'],
        caterer_cons: ['bad 1'],
        user_id: users[2].id,  
      },
      {
        id: 4,
        caterer_name: 'Caterer 4',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_type: 'Italian',
        caterer_rating: '3',
        caterer_pros: ['good 1','good 2'],
        caterer_cons: ['bad 1'],
        user_id: users[3].id, 
      },
    ]
  }
  
  function makeFloristsArray(users) {
    return [
      {
        id: 1,
        florist_name: 'Florist 1',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        florist_pros: ['good 1','good 2'],
        florist_cons: ['bad 1'],
        user_id: users[0].id,
      },
      {
        id: 2,
        florist_name: 'Florist 2',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        florist_pros: ['good 1','good 2'],
        florist_cons: ['bad 1'],
        user_id: users[1].id,  
      },
      {
        id: 3,
        florist_name: 'Florist 3',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        florist_pros: ['good 1','good 2'],
        florist_cons: ['bad 1'],
        user_id: users[2].id,  
      },
      {
        id: 4,
        florist_name: 'Florist 4',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        florist_pros: ['good 1','good 2'],
        florist_cons: ['bad 1'],
        user_id: users[3].id, 
      },
    ];
  }

  function makePhotographersArray(users) {
    return [
      {
        id: 1,
        photographer_name: 'Photographer 1',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        photographer_pros: ['good 1','good 2'],
        photographer_cons: ['bad 1'],
        user_id: users[0].id,
      },
      {
        id: 2,
        photographer_name: 'Photographer 2',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        photographer_pros: ['good 1','good 2'],
        photographer_cons: ['bad 1'],
        user_id: users[1].id,  
      },
      {
        id: 3,
        photographer_name: 'Photographer 3',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        photographer_pros: ['good 1','good 2'],
        photographer_cons: ['bad 1'],
        user_id: users[2].id,  
      },
      {
        id: 4,
        photographer_name: 'Photographer 4',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        photographer_pros: ['good 1','good 2'],
        photographer_cons: ['bad 1'],
        user_id: users[3].id, 
      },
    ];
  }

  function makeVenuesArray(users) {
    return [
      {
        id: 1,
        venue_name: 'Venue 1',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        venue_pros: ['good 1','good 2'],
        venue_cons: ['bad 1'],
        user_id: users[0].id,
      },
      {
        id: 2,
        venue_name: 'Venue 2',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        venue_pros: ['good 1','good 2'],
        venue_cons: ['bad 1'],
        user_id: users[1].id,  
      },
      {
        id: 3,
        venue_name: 'Venue 3',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        venue_pros: ['good 1','good 2'],
        venue_cons: ['bad 1'],
        user_id: users[2].id,  
      },
      {
        id: 4,
        venue_name: 'Venue 4',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        venue_pros: ['good 1','good 2'],
        venue_cons: ['bad 1'],
        user_id: users[3].id, 
      },
    ];
  }

  function makeGuestsArray(users) {
    return [
      {
        id: 1,
        guest_first_name: 'Test',
        guest_last_name: 'Guest 1',
        guest_type: 'Out of town',
        guest_plus_one: 'Yes',
        guest_address: '211 Peter DeHaven Drive, Phoenixville, PA 19460',
        user_id: users[0].id,
      },
      {
        id: 2,
        guest_first_name: 'Test',
        guest_last_name: 'Guest 2',
        guest_type: 'Local',
        guest_plus_one: 'No',
        guest_address: '211 Peter DeHaven Drive, Phoenixville, PA 19460',
        user_id: users[1].id,
      },
      {
        id: 3,
        guest_first_name: 'Test',
        guest_last_name: 'Guest 3',
        guest_type: 'Out of town',
        guest_plus_one: 'No',
        guest_address: '211 Peter DeHaven Drive, Phoenixville, PA 19460',
        user_id: users[2].id,  
      },
      {
        id: 4,
        guest_first_name: 'Test',
        guest_last_name: 'Guest 4',
        guest_type: 'Local',
        guest_plus_one: 'Yes',
        guest_address: '211 Peter DeHaven Drive, Phoenixville, PA 19460',
        user_id: users[3].id,
      },
    ];
  }
  
  function makeExpectedCaterer(users, caterer) {
    const user = users
      .find(user => user.id === caterer.user_id)
  
    return {
      id: caterer.id,
      caterer_name: caterer.caterer_name,
      caterer_website: caterer.caterer_website,
      caterer_price: caterer.caterer_price,
      caterer_type: caterer.caterer_type,
      caterer_rating: caterer.caterer_rating,
      caterer_pros: caterer.caterer_pros,
      caterer_cons: caterer.caterer_cons,
      user_id: user.id,
    }
  }

  function makeExpectedFlorist(users, florist) {
    const user = users
      .find(user => user.id === florist.user_id)
  
    return {
      id: florist.id,
      florist_name: florist.florist_name,
      florist_website: florist,florist_website,
      florist_price: florist.florist_price,
      florist_rating: florist.florist_rating,
      florist_pros: florist.florist_pros,
      florist_cons: florist.florist_cons,
      user_id: user.id,
    }
  }

  function makeExpectedPhotographer(users, photographer) {
    const user = users
      .find(user => user.id === photographer.user_id)
  
    return {
      id: photographer.id,
      photographer_name: photographer.photographer_name,
      photographer_website: photographer,photographer_website,
      photographer_price: photographer.photographer_price,
      photographer_rating: photographer.photographer_rating,
      photographer_pros: photographer.photographer_pros,
      photographer_cons: photographer.photographer_cons,
      user_id: user.id,
    }
  }

  function makeExpectedVenue(users, venue) {
    const user = users
      .find(user => user.id === venue.user_id)
  
    return {
      id: venue.id,
      venue_name: venue.venue_name,
      venue_website: venue,venue_website,
      venue_price: venue.venue_price,
      venue_type: venue.venue_type,
      venue_rating: venue.venue_rating,
      venue_pros: venue.venue_pros,
      venue_cons: venue.venue_cons,
      user_id: user.id,
    }
  }

  function makeExpectedGuest(users, guest) {
    const user = users
      .find(user => user.id === guest.user_id)
  
    return {
        id: guest.id,
        guest_first_name: guest.guest_first_name,
        guest_last_name: guest.guest_last_name,
        guest_type: guest.guest_type,
        guest_plus_one: guest.guest_plus_one,
        guest_address: guest.guest_address,
        user_id: user.id,
    }
  }

  function makeMaliciousCaterer(user) {
    const maliciousCaterer = {
        id: 911,
        caterer_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        caterer_website: 'Naughty naughty very naughty <script>alert("xss");</script>',
        caterer_price: '100',
        caterer_type: 'Naughty naughty very naughty <script>alert("xss");</script>',
        caterer_rating: '3',
        caterer_pros: ['good 1','good 2'],
        caterer_cons: ['bad 1'],
        user_id: user.id,
    }
    const expectedCaterer = {
      ...makeExpectedCaterer([user], maliciousCaterer),
      caterer_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      caterer_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      caterer_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousCaterer,
      expectedCaterer,
    }
  }

  function makeMaliciousFlorist(user) {
    const maliciousFlorist = {
        id: 911,
        florist_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        florist_website: 'Naughty naughty very naughty <script>alert("xss");</script>',
        florist_price: '100',
        florist_rating: '3',
        florist_pros: ['good 1','good 2'],
        florist_cons: ['bad 1'],
        user_id: user.id,
    }
    const expectedFlorist = {
      ...makeExpectedFlorist([user], maliciousFlorist),
      florist_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      florist_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousFlorist,
      expectedFlorist,
    }
  }

  function makeMaliciousPhotographer(user) {
    const maliciousPhotographer = {
        id: 911,
        photographer_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        photographer_website: 'Naughty naughty very naughty <script>alert("xss");</script>',
        photographer_price: '100',
        photographer_rating: '3',
        photographer_pros: ['good 1','good 2'],
        photographer_cons: ['bad 1'],
        user_id: user.id,
    }
    const expectedPhotographer = {
      ...makeExpectedPhotographer([user], maliciousPhotographer),
      photographer_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      photographer_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousPhotographer,
      expectedPhotographer,
    }
  }

  function makeMaliciousVenue(user) {
    const maliciousVenue = {
        id: 911,
        venue_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        venue_website: 'Naughty naughty very naughty <script>alert("xss");</script>',
        venue_price: '100',
        venue_rating: '3',
        venue_capacity: '200',
        venue_pros: ['good 1','good 2'],
        venue_cons: ['bad 1'],
        user_id: user.id,
    }
    const expectedVenue = {
      ...makeExpectedVenue([user], maliciousVenue),
      venue_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      venue_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousVenue,
      expectedVenue,
    }
  }

  function makeMaliciousGuest(user) {
    const maliciousGuest = {
        id: 911,
        guest_first_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        guest_last_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        guest_type: guest.guest_type,
        guest_plus_one: guest.guest_plus_one,
        guest_address: 'Naughty naughty very naughty <script>alert("xss");</script>',
        user_id: user.id,
    }
    const expectedGuest = {
      ...makeExpectedGuest([user], maliciousGuest),
      guest_first_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      guest_last_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      guest_address: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousGuest,
      expectedGuest,
    }
  }
  
  function makeFixtures() {
    const testUsers = makeUsersArray()
    const testCaterers = makeCaterersArray(testUsers)
    const testFlorists = makeFloristsArray(testUsers)
    const testPhotographers = makePhotographersArray(testUsers)
    const testVenues = makeVenuesArray(testUsers)
    const testGuests = makeGuestsArray(testUsers)
    return { testUsers, testCaterers, testFlorists, testPhotographers, testVenues, testGuests }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          users,
          caterers,
          florists,
          photographers,
          venues,
          guests
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE caterers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE florists_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE photographers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE venues_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE guests_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('caterers_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('florists_id_seq', 0)`),
          trx.raw(`SELECT setval('photographers_id_seq', 0)`),
          trx.raw(`SELECT setval('venues_id_seq', 0)`),
          trx.raw(`SELECT setval('guests_id_seq', 0)`),
        ])
      )
    )
  }
  
  function seedCaterersTables(db, users, caterers) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('caterers').insert(caterers)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('caterers_id_seq', ?)`,
          [caterers[caterers.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousCaterer(db, user, caterer) {
    return db
      .into('users')
      .insert([user])
      .then(() =>
        db
          .into('caterers')
          .insert([caterer])
      )
  }
  
  module.exports = {
    makeUsersArray,
    makeCaterersArray,
    makeFloristsArray,
    makePhotographersArray,
    makeVenuesArray,
    makeGuestsArray,
    makeExpectedCaterer,
    makeExpectedFlorist,
    makeExpectedPhotographer,
    makeExpectedVenue,
    makeExpectedGuest,
    makeMaliciousCaterer,
    makeMaliciousFlorist,
    makeMaliciousPhotographer,
    makeMaliciousVenue,
    makeMaliciousGuest,
    
  
    makeFixtures,
    cleanTables,
    seedCaterersTables,
    seedMaliciousCaterer,
    
  }