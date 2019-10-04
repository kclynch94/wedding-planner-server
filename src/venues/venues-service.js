const VenuesService = {
    getAllVenues(knex, user_id) {
        return knex.select('*').from('venues').where('user_id', user_id)
    },
    insertVenue(knex, newVenue) {
        return knex
            .insert(newVenue)
            .into('venues')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('venues').select('*').where('id', id).first()       
    },
    deleteVenue(knex, id) {
        return knex('venues')
            .where({ id })
            .delete()
    },
    updateVenue(knex, id, newVenueFields) {
        return knex('venues')
        .where({ id })
        .update(newVenueFields)
    },
}

module.exports = VenuesService