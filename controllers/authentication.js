const { getConnection, connect, closePool } = require('../db/connect');

//authentication middleware
const passport = require('passport');
//hash and compare passwords
const bcrypt = require('bcrypt');
//display a message to the user after an action has been taken(exp: successful login )

const getLogin = (req, res) => {
  res.render('login.ejs');
};

const postLogin = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true,
});

const getRegister = (req, res) => {
  res.render('register.ejs');
};

const postRegister = async (req, res) => {
  try {
    //hash the password of the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //test
    console.log('hashedPassword:', hashedPassword);
    console.log('req.body.password:', req.body.password);
    console.log(Date.now());
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.password);
    await connect();
    const connection = await getConnection();
    //store the new user in our database
    await connection.execute(
      `INSERT INTO users (id, name, email, password) VALUES (${Date.now()}, '${
        req.body.name
      }', '${req.body.email}', '${hashedPassword}')`
    );
    await connection.execute(`commit`);
    await closePool();
    //if the registration is succefull, redirect to login page
    res.redirect('/auth/login');
  } catch (e) {
    console.error(e);
    //if the registration is failed, redirect to registration page
    res.redirect('/auth/register');
  }
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/auth/login');
  });
};

const dashboard = async (req, res) => {
  const user = await req.user;
  console.log('the user name: ', user.name);
  res.render('index.ejs', { name: user.name });
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
  dashboard,
};
