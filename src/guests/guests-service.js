const GuestsService = {
    getAllGuests(knex) {
        return knex.select('*').from('guests')
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