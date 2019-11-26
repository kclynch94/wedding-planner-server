const path = require('path')
const express = require('express')
const xss = require('xss')
const CaterersService = require('./caterers-service')
const ProsService = require('../pros/pros-service')
const ConsService = require('../cons/cons-service')
const {requireAuth} = require('../middleware/jwt-auth')

const caterersRouter = express.Router()
const jsonParser = express.json()

const serializeCaterer = caterer => {
    return {
        id: caterer.id,
        caterer_name: xss(caterer.caterer_name),
        caterer_website: xss(caterer.caterer_website),
        caterer_price: caterer.caterer_price,
        caterer_rating: caterer.caterer_rating,
        caterer_type: xss(caterer.caterer_type),
        user_id: caterer.user_id
    }
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

caterersRouter
    .route('/')
    .all(requireAuth)
    .get(jsonParser, (req, res, next) => {
            if(req.user.user_email){
            const knexInstance = req.app.get('db')
            CaterersService.getAllCaterers(knexInstance, req.user.id)
            .then(caterers => {
                const serializedCaterers = caterers.map(serializeCaterer)
                const prosPromises = []
                const consPromises = []
                serializedCaterers.forEach(c => {
                    prosPromises.push(ProsService.getAllProsBy(knexInstance, req.user.id, 'caterer', c.id ))
                    consPromises.push(ConsService.getAllConsBy(knexInstance, req.user.id, 'caterer', c.id ))
                })
                const promises = [...prosPromises, ...consPromises]
                Promise.all(promises).then(data => {
                    
                    const caterer_pros=flatten(data).filter(d => d.hasOwnProperty('pro_type'))
                    const caterer_cons=flatten(data).filter(d => d.hasOwnProperty('con_type'))
                    console.log('caterer cons', caterer_cons)
                    const svs = serializedCaterers.map(caterer => {
                        const ps = caterer_pros.filter(p => p.ref_id === caterer.id)
                        const cs = caterer_cons.filter(c => c.ref_id === caterer.id)
                        return {...caterer, caterer_pros: ps, caterer_cons:cs}
                    })
                    console.log('svs', svs)
                    res.json(svs)
                })
                
            })
                .catch(next)
            } else {
                return res.status(403).json({error: "not authenticated"})
            }
        })
    .post(jsonParser, (req, res, next) => {
        const { caterer_name, caterer_website, caterer_pros, caterer_type, caterer_cons } = req.body
        const newCaterer = { caterer_name, caterer_website, caterer_type, user_id: req.user.id }
        const requiredFields = { caterer_name }

        for (const [key, value] of Object.entries(requiredFields))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })

            CaterersService.insertCaterer(
                req.app.get('db'),
                newCaterer
            )
            .then(caterer => {
                const pros = []
                const cons = []

                caterer_pros.forEach(p => {
                    const newPro = { pro_content: p, pro_type: 'caterer', ref_id: caterer.id, user_id: caterer.user_id }
                    pros.push(ProsService.insertPro(
                        req.app.get('db'),
                        newPro
                    ))
                })

                caterer_cons.forEach(c => {
                    const newCon = { con_content: c, con_type: 'caterer', ref_id: caterer.id, user_id: caterer.user_id }
                    cons.push(ConsService.insertCon(
                        req.app.get('db'),
                        newCon
                    ))
                })
                const promises = [...pros, ...cons]
                Promise.all(promises).then((data)=> {
                    const serializedCaterer = serializeCaterer(caterer)
                    serializedCaterer.caterer_pros=data.filter(d => d.hasOwnProperty('pro_type'))
                    serializedCaterer.caterer_cons=data.filter(d => d.hasOwnProperty('con_type'))
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${caterer.id}`))
                        .json(serializedCaterer)
                })
            })
                .catch(next)
    })

caterersRouter
    .route('/:caterer_id')
    .all(requireAuth)
    .get((req, res, next) => {
        res.json(serializeCaterer(res.caterer))
    })
    .delete((req, res, next) => {
        CaterersService.deleteCaterer(
            req.app.get('db'),
            req.params.caterer_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, async(req, res, next) => {
        const knexInstance = req.app.get('db')
        const { caterer_name, caterer_website, caterer_price, caterer_rating, caterer_type, caterer_pros, caterer_cons } = req.body
        const catererToUpdate = { caterer_name, caterer_website, caterer_price, caterer_rating, caterer_type }

        CaterersService.updateCaterer(
            knexInstance,
            req.params.caterer_id,
            catererToUpdate
        )
        .then(async (numRowsAffected) => {
            const prosToUpdate = []
            const prosToDelete = []
            const prosToCreate = []
            const consToUpdate = []
            const consToDelete = []
            const consToCreate = []
            //1. Update existing pros/cons or create pros/cons that do not have an id
            const currentPros = await ProsService.getAllProsBy(knexInstance, req.user.id, 'caterer', req.params.caterer_id )
            const currentProsIds = currentPros.map(p => p.id)
            const requestProsIds = caterer_pros.map(p => p.id)
            const currentCons = await ConsService.getAllConsBy(knexInstance, req.user.id, 'caterer', req.params.caterer_id )
            const currentConsIds = currentCons.map(c => c.id)
            const requestConsIds = caterer_cons.map(c => c.id)
            const proIdsToDelete = currentProsIds.filter(id => !requestProsIds.includes(id))
            const conIdsToDelete = currentConsIds.filter(id => !requestConsIds.includes(id))
            caterer_pros.forEach(p => {
                if (currentProsIds.includes(p.id)) {
                    prosToUpdate.push(ProsService.updatePro(knexInstance, p.id, {pro_content: p.pro_content}))
                } else {
                    prosToCreate.push(ProsService.insertPro(knexInstance, {pro_type: 'caterer', pro_content: p.pro_content, ref_id: req.params.caterer_id, user_id: req.user.id}))
                }
            })
            caterer_cons.forEach(c => {
                if (currentConsIds.includes(c.id)) {
                    consToUpdate.push(ConsService.updateCon(knexInstance, c.id, {con_content: c.con_content}))
                } else {
                    consToCreate.push(ConsService.insertCon(knexInstance, {con_type: 'caterer', con_content: c.con_content, ref_id: req.params.caterer_id, user_id: req.user.id}))
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

module.exports = caterersRouter