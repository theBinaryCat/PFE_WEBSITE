const express = require('express')
const router = express.Router()
const {dashboard} = require('../controllers/dashboard')
const {checkAuthenticated} = require('../middlewares/authentification')


router.get('/', checkAuthenticated, dashboard)

module.exports = router