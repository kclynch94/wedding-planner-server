const ConsService = {
    getAllCons(knex, user_id) {
        return knex.select('*').from('cons').where('user_id', user_id)
    },
    getAllConsBy(knex, user_id, con_type, ref_id) {
        return knex.select('*').from('cons').where({
            user_id,
            con_type,
            ref_id
        })
    },
    insertCon(knex, newCon) {
        return knex
            .insert(newCon)
            .into('cons')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('cons').select('*').where('id', id).first()       
    },
    deleteCon(knex, id) {
        return knex('cons')
            .where({ id })
            .delete()
    },
    updateCon(knex, id, newConFields) {
        return knex('cons')
        .where({ id })
        .update(newConFields)
    },
}

module.exports = ConsService