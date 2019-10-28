const GuestsService = {
    getAllGuests(knex, user_id) {
        return knex.select('*').from('guests').where('user_id', user_id)
    },
    insertGuest(knex, newGuest) {
        return knex
            .insert(newGuest)
            .into('guests')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('guests').select('*').where('id', id).first()       
    },
    deleteGuest(knex, id) {
        return knex('guests')
            .where({ id })
            .delete()
    },
    updateGuest(knex, id, newGuestFields) {
        return knex('guests')
        .where({ id })
        .update(newGuestFields)
    },
}

module.exports = GuestsService