const PhotographersService = {
    getAllPhotographers(knex, user_id) {
        return knex.select('*').from('photographers').where('user_id', user_id)
    },
    insertPhotographer(knex, newPhotographer) {
        return knex
            .insert(newPhotographer)
            .into('photographers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('photographers').select('*').where('id', id).first()       
    },
    deletePhotographer(knex, id) {
        return knex('photographers')
            .where({ id })
            .delete()
    },
    updatePhotographer(knex, id, newPhotographerFields) {
        return knex('photographers')
        .where({ id })
        .update(newPhotographerFields)
    },
}

module.exports = PhotographersService