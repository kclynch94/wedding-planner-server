const ProsService = {
    getAllPros(knex, user_id) {
        return knex.select('*').from('pros').where('user_id', user_id)
    },
    getAllProsBy(knex, user_id, pro_type, ref_id) {
        return knex.select('*').from('pros').where({
            user_id,
            pro_type,
            ref_id
        })
    },
    insertPro(knex, newPro) {
        return knex
            .insert(newPro)
            .into('pros')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('pros').select('*').where('id', id).first()       
    },
    deletePro(knex, id) {
        return knex('pros')
            .where({ id })
            .delete()
    },
    updatePro(knex, id, newProFields) {
        return knex('pros')
        .where({ id })
        .update(newProFields)
    },
}

module.exports = ProsService