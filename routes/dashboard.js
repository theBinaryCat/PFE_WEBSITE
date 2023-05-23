const express = require('express')
const router = express.Router()
const {dashboard, fetchDataCA} = require('../controllers/dashboard')
const {checkAuthenticated} = require('../middlewares/authentification')
//use static files(.css, .html, ...)
router.use(express.static('./views'))

router.get('/', checkAuthenticated, dashboard)
router.get('/api/data', checkAuthenticated, fetchDataCA)
router.get('/chiffre-daffaire', checkAuthenticated, (req, res) => {
    res.render('dashboard_CA.ejs')})

module.exports = router