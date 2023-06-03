const express = require("express");
const router = express.Router();
const {
  dashboard,
  dashboard_CA,
  fetchDataCA,
} = require("../controllers/dashboard_ca");

const { dashboardContrats } = require("../controllers/dashboard_contrats");

const { checkAuthenticated } = require("../middlewares/authentification");
//use static files(.css, .html, ...)
router.use(express.static("./views"));

router.get("/", checkAuthenticated, dashboard);
router.get("/api/dataCA", checkAuthenticated, fetchDataCA);
router.get("/chiffre-daffaire", checkAuthenticated, dashboard_CA);
router.get("/nombre-de-contrats", checkAuthenticated, dashboardContrats);

module.exports = router;
