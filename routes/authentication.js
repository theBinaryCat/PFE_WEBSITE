const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
} = require("../controllers/authentication");
const { checkNotAuthenticated } = require("../middlewares/authentification");
const { getConnection, connect, closePool } = require("../db/connect");

//authentication middleware
const passport = require("passport");
router.use(express.json());

const initialize = require("../passport-config");
initialize(
  passport,
  //getUserByEmail
  async (email) => {
    try {
      await connect();
      const connection = await getConnection();
      const result = await connection.execute(
        "SELECT * FROM users WHERE email = :email",
        { email }
      );
      await closePool();
      if (result.rows.length > 0) {
        const user = {};
        const metaData = result.metaData;
        const row = result.rows[0];
        //from array to json format
        for (let i = 0; i < metaData.length; i++) {
          const columnName = metaData[i].name.toLowerCase();
          user[columnName] = row[i];
        }
        //test
        console.log("getUserByEmail", user);
        return user;
      }
    } catch (error) {
      console.error(error);
    }
  },
  //getUserById
  async (id) => {
    try {
      await connect();
      const connection = await getConnection();
      const result = await connection.execute(
        "SELECT * FROM users WHERE TO_NUMBER(id) = :id",
        { id }
      );
      await closePool();
      if (result.rows.length > 0) {
        const user = {};
        const metaData = result.metaData;
        const row = result.rows[0];
        //from array to json format
        for (let i = 0; i < metaData.length; i++) {
          const columnName = metaData[i].name.toLowerCase();
          user[columnName] = row[i];
        }
        //test
        console.log("getUserById", user);
        return user;
      }
    } catch (error) {
      console.error(error);
    }
  }
);

router.use(passport.initialize());

//use static files(.css, .html, ...)
router.use(express.static("./views"));
//login
router
  .route("/login")
  .get(checkNotAuthenticated, getLogin)
  .post(checkNotAuthenticated, postLogin);
//register
router
  .route("/register")
  .get(checkNotAuthenticated, getRegister)
  .post(checkNotAuthenticated, postRegister);
//logout
router.get("/logout", logout);
module.exports = router;
