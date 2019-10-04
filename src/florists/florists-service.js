const FloristsService = {
    getAllFlorists(knex, user_id) {
        return knex.select('*').from('florists').where('user_id', user_id)
    },
    insertFlorist(knex, newFlorist) {
        return knex
            .insert(newFlorist)
            .into('florists')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('florists').select('*').where('id', id).first()       
    },
    deleteFlorist(knex, id) {
        return knex('florists')
            .where({ id })
            .delete()
    },
    updateFlorist(knex, id, newFloristFields) {
        return knex('florists')
        .where({ id })
        .update(newFloristFields)
    },
}

module.exports = FloristsService