const express = require('express')
const router = express.Router()
const {dashboard, fetchDataCA} = require('../controllers/dashboard')
const {checkAuthenticated} = require('../middlewares/authentification')


router.get('/', checkAuthenticated, dashboard)
router.get('/api/data', checkAuthenticated, fetchDataCA)
router.get('/chiffre-daffaire', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs')})

module.exports = router