function makeUsersArray() {
    return [
      {
        id: 2,
        user_first_name: 'Test 2',
        user_last_name: 'User',
        user_email: 'test2@gmail.com',
        user_password: 'password1234',
        user_password_digest: '$2b$10$Q/NVKq9bnQyeo1KBTLPDFuw1j0sjhb02VhcUCMnhHpJyNWe45KHFG',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),       
      },
      {
        id: 3,
        user_first_name: 'Test 3',
        user_last_name: 'User',
        user_email: 'test3@gmail.com',
        user_password: 'password1234',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),      
      },
      {
        id: 4,
        user_first_name: 'Test 4',
        user_last_name: 'User',
        user_email: 'test4@gmail.com',
        user_password: 'password1234',
        user_created_at: new Date('2029-01-22T16:28:32.615Z'),
      },
    ]
  }

  function makeProsArray(users) {
    return [
      {
        id: 1,
        pro_content: 'Pro 1',
        pro_type: 'Caterer',
        ref_id: 1,
        user_id: users[0].id,    
      },
      {
        id: 2,
        pro_content: 'Pro 2',
        pro_type: 'Caterer',
        ref_id: 1,
        user_id: users[1].id,    
      },
      {
        id: 3,
        pro_content: 'Pro 3',
        pro_type: 'Caterer',
        ref_id: 2,
        user_id: users[2].id,    
      },
    ]
  }

  function makeConsArray(users) {
    return [
      {
        id: 1,
        con_content: 'Con 1',
        con_type: 'Caterer',
        ref_id: 1,
        user_id: users[0].id,    
      },
      {
        id: 2,
        con_content: 'Con 2',
        con_type: 'Caterer',
        ref_id: 1,
        user_id: users[1].id,    
      },
      {
        id: 3,
        con_content: 'Con 3',
        con_type: 'Caterer',
        ref_id: 2,
        user_id: users[2].id,    
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
        caterer_rating: '3',
        caterer_type: 'Italian',
        user_id: users[0].id, 
      },
      {
        id: 2,
        caterer_name: 'Caterer 2',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_rating: '3',
        caterer_type: 'Italian',
        user_id: users[1].id,  
      },
      {
        id: 3,
        caterer_name: 'Caterer 3',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_rating: '3',
        caterer_type: 'Italian',
        user_id: users[2].id,  
      },
      {
        id: 4,
        caterer_name: 'Caterer 4',
        caterer_website: 'https://www.youtube.com',
        caterer_price: '5000',
        caterer_rating: '3',
        caterer_type: 'Italian',
        user_id: 1, 
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
        user_id: users[0].id,
      },
      {
        id: 2,
        florist_name: 'Florist 2',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        user_id: users[1].id,  
      },
      {
        id: 3,
        florist_name: 'Florist 3',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        user_id: users[2].id,  
      },
      {
        id: 4,
        florist_name: 'Florist 4',
        florist_website: 'https://www.youtube.com',
        florist_price: '5000',
        florist_rating: '3',
        user_id: 1, 
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
        user_id: users[0].id,
      },
      {
        id: 2,
        photographer_name: 'Photographer 2',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        user_id: users[1].id,  
      },
      {
        id: 3,
        photographer_name: 'Photographer 3',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        user_id: users[2].id,  
      },
      {
        id: 4,
        photographer_name: 'Photographer 4',
        photographer_website: 'https://www.youtube.com',
        photographer_price: '5000',
        photographer_rating: '3',
        user_id: 1, 
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
        user_id: users[0].id,
      },
      {
        id: 2,
        venue_name: 'Venue 2',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        user_id: users[1].id,  
      },
      {
        id: 3,
        venue_name: 'Venue 3',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        user_id: users[2].id,  
      },
      {
        id: 4,
        venue_name: 'Venue 4',
        venue_website: 'https://www.youtube.com',
        venue_price: '5000',
        venue_rating: '3',
        venue_capacity: '200',
        user_id: 1, 
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
        user_id: 1,
      },
    ];
  }
  
  function makeExpectedPro(pro) {
    return {
      id: pro.id,
      pro_content: pro.pro_content,
      pro_type: pro.pro_type,
      ref_id: pro.ref_id,
      user_id: pro.user_id,
    }
  }

  function makeExpectedCon(con) {
    return {
      id: con.id,
      con_content: con.con_content,
      con_type: con.con_type,
      ref_id: con.ref_id,
      user_id: con.user_id,
    }
  }
  
  function makeExpectedCaterer(caterer) {
      return {
        id: caterer.id,
        caterer_name: caterer.caterer_name,
        caterer_website: caterer.caterer_website,
        caterer_price: caterer.caterer_price,
        caterer_type: caterer.caterer_type,
        caterer_rating: caterer.caterer_rating,
        caterer_pros: [],
        caterer_cons: [],
        user_id: caterer.user_id,
      }
  }

  function makeExpectedFlorist(florist) {
    return {
      id: florist.id,
      florist_name: florist.florist_name,
      florist_website: florist.florist_website,
      florist_price: florist.florist_price,
      florist_rating: florist.florist_rating,
      florist_pros: [],
      florist_cons: [],
      user_id: florist.user_id,
    }
  }

  function makeExpectedPhotographer(photographer) {
    return {
      id: photographer.id,
      photographer_name: photographer.photographer_name,
      photographer_website: photographer.photographer_website,
      photographer_price: photographer.photographer_price,
      photographer_rating: photographer.photographer_rating,
      photographer_pros: [],
      photographer_cons: [],
      user_id: photographer.user_id,
    }
  }

  function makeExpectedVenue(venue) {
    return {
      id: venue.id,
      venue_name: venue.venue_name,
      venue_website: venue.venue_website,
      venue_price: venue.venue_price,
      venue_capacity: venue.venue_capacity,
      venue_rating: venue.venue_rating,
      venue_pros: [],
      venue_cons: [],
      user_id: venue.user_id,
    }
  }

  function makeExpectedGuest(guest) {
    return {
        id: guest.id,
        guest_first_name: guest.guest_first_name,
        guest_last_name: guest.guest_last_name,
        guest_type: guest.guest_type,
        guest_plus_one: guest.guest_plus_one,
        guest_address: guest.guest_address,
        user_id: guest.user_id,
    }
  }

  function makeMaliciousPro(user) {
    const maliciousPro = {
        id: 911,
        pro_content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        pro_type: 'venue',
        ref_id: 3,
        user_id: user.id,
    }
    const expectedPro = {
      ...makeExpectedPro(maliciousPro),
      pro_content: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      pro_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }
    return {
      maliciousPro,
      expectedPro,
    }
  }

  function makeMaliciousCon(user) {
    const maliciousCon = {
        id: 911,
        con_content: 'Naughty naughty very naughty <script>alert("xss");</script>',
        con_type: 'Naughty naughty very naughty <script>alert("xss");</script>',
        ref_id: 3,
        user_id: user.id,
    }
    const expectedCon = {
      ...makeExpectedPro(maliciousCon),
      con_content: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      con_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }
    return {
      maliciousCon,
      expectedCon,
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
        user_id: user.id,
    }
    const expectedCaterer = {
      ...makeExpectedCaterer(maliciousCaterer),
      caterer_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      caterer_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      caterer_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      caterer_pros: [],
      caterer_cons: []
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
        user_id: user.id,
    }
    const expectedFlorist = {
      ...makeExpectedFlorist(maliciousFlorist),
      florist_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      florist_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      florist_pros: [],
      florist_cons: []
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
        user_id: user.id,
    }
    const expectedPhotographer = {
      ...makeExpectedPhotographer(maliciousPhotographer),
      photographer_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      photographer_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      photographer_pros: [],
      photographer_cons: []
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
        user_id: user.id,
    }
    const expectedVenue = {
      ...makeExpectedVenue(maliciousVenue),
      venue_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      venue_website: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      venue_pros: [],
      venue_cons: []
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
        guest_type: 'Naughty naughty very naughty <script>alert("xss");</script>',
        guest_plus_one: 'Yes',
        guest_address: 'Naughty naughty very naughty <script>alert("xss");</script>',
        user_id: user.id,
    }
    const expectedGuest = {
      ...makeExpectedGuest(maliciousGuest),
      guest_first_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      guest_last_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      guest_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      guest_address: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousGuest,
      expectedGuest,
    }
  }
  
  function makeFixtures() {
    const testUsers = makeUsersArray()
    const testPros = makeProsArray(testUsers)
    const testCons = makeConsArray(testUsers)
    const testCaterers = makeCaterersArray(testUsers)
    const testFlorists = makeFloristsArray(testUsers)
    const testPhotographers = makePhotographersArray(testUsers)
    const testVenues = makeVenuesArray(testUsers)
    const testGuests = makeGuestsArray(testUsers)
    return { testUsers, testPros, testCons, testCaterers, testFlorists, testPhotographers, testVenues, testGuests }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          users,
          pros,
          cons,
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
          trx.raw(`ALTER SEQUENCE pros_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE cons_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE florists_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE photographers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE venues_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE guests_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('caterers_id_seq', 0)`),
          trx.raw(`SELECT setval('pros_id_seq', 0)`),
          trx.raw(`SELECT setval('cons_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('florists_id_seq', 0)`),
          trx.raw(`SELECT setval('photographers_id_seq', 0)`),
          trx.raw(`SELECT setval('venues_id_seq', 0)`),
          trx.raw(`SELECT setval('guests_id_seq', 0)`),
        ])
      )
    )
  }

  function seedProsTables(db, users, pros) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('pros').insert(pros)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('pros_id_seq', ?)`,
          [pros[pros.length - 1].id],
        ),
      ])
    })
  }

  function seedMaliciousPro(db, pro) {
    return db
        .into('pros')
        .insert([pro])
  }

  function seedConsTables(db, users, cons) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('cons').insert(cons)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('cons_id_seq', ?)`,
          [cons[cons.length - 1].id],
        ),
      ])
    })
  }

  function seedMaliciousCon(db, con) {
    return db
        .into('cons')
        .insert([con])
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
  
  function seedMaliciousCaterer(db, caterer) {
    return db
        .into('caterers')
        .insert([caterer])
  }

  function seedFloristsTables(db, users, florists) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('florists').insert(florists)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('florists_id_seq', ?)`,
          [florists[florists.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousFlorist(db, florist) {
    return db
        .into('florists')
        .insert([florist])
  }

  function seedPhotographersTables(db, users, photographers) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('photographers').insert(photographers)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('photographers_id_seq', ?)`,
          [photographers[photographers.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousPhotographer(db, photographer) {
    return db
        .into('photographers')
        .insert([photographer])
  }

  function seedVenuesTables(db, users, venues) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('venues').insert(venues)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('venues_id_seq', ?)`,
          [venues[venues.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousVenue(db, venue) {
    return db
        .into('venues')
        .insert([venue])
  }
  
  function seedGuestsTables(db, users, guests) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      await trx.into('guests').insert(guests)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('guests_id_seq', ?)`,
          [guests[guests.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousGuest(db, guest) {
    return db
        .into('guests')
        .insert([guest])
  }

  function seedUsersTables(db, users) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await trx.into('users').insert(users)
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
      ])
    })
  }
  
  function seedMaliciousUser(db, user) {
    return db
        .into('users')
        .insert([user])
  }
  module.exports = {
    makeUsersArray,
    makeProsArray,
    makeConsArray,
    makeCaterersArray,
    makeFloristsArray,
    makePhotographersArray,
    makeVenuesArray,
    makeGuestsArray,
    makeExpectedPro,
    makeExpectedCon,
    makeExpectedCaterer,
    makeExpectedFlorist,
    makeExpectedPhotographer,
    makeExpectedVenue,
    makeExpectedGuest,
    makeMaliciousPro,
    makeMaliciousCon,
    makeMaliciousCaterer,
    makeMaliciousFlorist,
    makeMaliciousPhotographer,
    makeMaliciousVenue,
    makeMaliciousGuest,
    
  
    makeFixtures,
    cleanTables,
    seedProsTables,
    seedMaliciousPro,
    seedConsTables,
    seedMaliciousCon,
    seedCaterersTables,
    seedMaliciousCaterer,
    seedFloristsTables,
    seedMaliciousFlorist,
    seedPhotographersTables,
    seedMaliciousPhotographer,
    seedVenuesTables,
    seedMaliciousVenue,
    seedGuestsTables,
    seedMaliciousGuest,
    seedUsersTables,
    seedMaliciousUser,
    
  }