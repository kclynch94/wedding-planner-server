const path = require('path')
const express = require('express')
const xss = require('xss')
const FloristsService = require('./florists-service')
const ProsService = require('../pros/pros-service')
const ConsService = require('../cons/cons-service')
const {requireAuth} = require('../middleware/jwt-auth')

const floristsRouter = express.Router()
const jsonParser = express.json()

const serializeFlorist = florist => {
    return {
        id: florist.id,
        florist_name: xss(florist.florist_name),
        florist_website: xss(florist.florist_website),
        florist_price: florist.florist_price,
        florist_rating: florist.florist_rating,
        user_id: florist.user_id
    }
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

floristsRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            FloristsService.getAllFlorists(knexInstance, req.user.id)
                .then(florists => {
                    const serializedFlorists = florists.map(serializeFlorist)
                    const prosPromises = []
                    const consPromises = []
                    serializedFlorists.forEach(f => {
                        prosPromises.push(ProsService.getAllProsBy(knexInstance, req.user.id, 'florist', f.id ))
                        consPromises.push(ConsService.getAllConsBy(knexInstance, req.user.id, 'florist', f.id ))
                    })
                    const promises = [...prosPromises, ...consPromises]
                    Promise.all(promises).then(data => {
                        const florist_pros=flatten(data).filter(d => d.hasOwnProperty('pro_type'))
                        const florist_cons=flatten(data).filter(d => d.hasOwnProperty('con_type'))
                        const svs = serializedFlorists.map(f => {
                            const ps = florist_pros.filter(p => p.ref_id === f.id)
                            const cs = florist_cons.filter(c => c.ref_id === f.id)
                            return {...f, florist_pros: ps, florist_cons:cs}
                        })
                        res.json(svs)
                    })
                    
                })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { florist_name, florist_website, florist_pros, florist_cons } = req.body
        const newFlorist = { florist_name, florist_website, user_id: req.user.id }
        const requiredFields = { florist_name }

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            FloristsService.insertFlorist(
                req.app.get('db'),
                newFlorist
            )
                .then(florist => {
                    const pros = []
                    const cons = []

                    florist_pros.forEach(p => {
                        const newPro = { pro_content: p, pro_type: 'florist', ref_id: florist.id, user_id: florist.user_id }
                        pros.push(ProsService.insertPro(
                            req.app.get('db'),
                            newPro
                        ))
                    })

                    florist_cons.forEach(c => {
                        const newCon = { con_content: c, con_type: 'florist', ref_id: florist.id, user_id: florist.user_id }
                        cons.push(ConsService.insertCon(
                            req.app.get('db'),
                            newCon
                        ))
                    })
                    const promises = [...pros, ...cons]
                    Promise.all(promises).then((data)=> {
                        const serializedFlorist = serializeFlorist(florist)
                        serializedFlorist.florist_pros=data.filter(d => d.hasOwnProperty('pro_type'))
                        serializedFlorist.florist_cons=data.filter(d => d.hasOwnProperty('con_type'))
                        res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${florist.id}`))
                            .json(serializedFlorist)
                    })
                })
                .catch(next)
    })

floristsRouter
    .route('/:florist_id')
    .all(requireAuth)
    .get((req, res, next) => {
        res.json(serializeFlorist(res.florist))
    })
    .delete((req, res, next) => {
        FloristsService.deleteFlorist(
            req.app.get('db'),
            req.params.florist_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, async(req, res, next) => {
        const knexInstance = req.app.get('db')
        const { florist_name, florist_website, florist_price, florist_rating, florist_pros, florist_cons } = req.body
        const floristToUpdate = { florist_name, florist_website, florist_price, florist_rating }

        FloristsService.updateFlorist(
            req.app.get('db'),
            req.params.florist_id,
            floristToUpdate
        )
            .then(async (numRowsAffected) => {
                const prosToUpdate = []
                const prosToDelete = []
                const prosToCreate = []
                const consToUpdate = []
                const consToDelete = []
                const consToCreate = []
                //1. Update existing pros/cons or create pros/cons that do not have an id
                const currentPros = await ProsService.getAllProsBy(knexInstance, req.user.id, 'florist', req.params.florist_id )
                const currentProsIds = currentPros.map(p => p.id)
                const requestProsIds = florist_pros.map(p => p.id)
                const currentCons = await ConsService.getAllConsBy(knexInstance, req.user.id, 'florist', req.params.florist_id )
                const currentConsIds = currentCons.map(c => c.id)
                const requestConsIds = florist_cons.map(c => c.id)
                const proIdsToDelete = currentProsIds.filter(id => !requestProsIds.includes(id))
                const conIdsToDelete = currentConsIds.filter(id => !requestConsIds.includes(id))
                florist_pros.forEach(p => {
                    if (currentProsIds.includes(p.id)) {
                        prosToUpdate.push(ProsService.updatePro(knexInstance, p.id, {pro_content: p.pro_content}))
                    } else {
                        prosToCreate.push(ProsService.insertPro(knexInstance, {pro_type: 'florist', pro_content: p.pro_content, ref_id: req.params.florist_id, user_id: req.user.id}))
                    }
                })
                florist_cons.forEach(c => {
                    if (currentConsIds.includes(c.id)) {
                        consToUpdate.push(ConsService.updateCon(knexInstance, c.id, {con_content: c.con_content}))
                    } else {
                        consToCreate.push(ConsService.insertCon(knexInstance, {con_type: 'florist', con_content: c.con_content, ref_id: req.params.florist_id, user_id: req.user.id}))
                    }
                })
                //2. Delete the pros/cons that do not exist anymore
                proIdsToDelete.forEach(id => {
                    prosToDelete.push(ProsService.deletePro(knexInstance, id))
                })
                conIdsToDelete.forEach(id => {
                    consToDelete.push(ConsService.deleteCon(knexInstance, id))
                })
                const promises = [...prosToUpdate, ...prosToDelete, ...prosToCreate, ...consToUpdate, ...consToDelete, ...consToCreate]
                Promise.all(promises).then(data => {
                    return data
                })
                
                
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = floristsRouter