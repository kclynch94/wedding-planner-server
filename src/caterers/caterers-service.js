const CaterersService = {
    getAllCaterers(knex, user_id) {
        return knex.select('*').from('caterers').where('user_id', user_id)
    },
    insertCaterer(knex, newCaterer) {
        return knex
            .insert(newCaterer)
            .into('caterers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('caterers').select('*').where('id', id).first()       
    },
    deleteCaterer(knex, id) {
        return knex('caterers')
            .where({ id })
            .delete()
    },
    updateCaterer(knex, id, newCatererFields) {
        return knex('caterers')
        .where({ id })
        .update(newCatererFields)
    },
}

module.exports = CaterersService