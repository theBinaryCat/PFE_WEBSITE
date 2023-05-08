if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { getConnection, connect, closePool } = require('./db/connect')
const {checkAuthenticated, checkNotAuthenticated} = require('./middlewares/authentification')
const {getLogin, postLogin, getRegister, postRegister, logout, dashboard, getCSS} = require('./controllers/authentication')
const app = express()

//authentication middleware 
const passport = require('passport')
//display a message to the user after an action has been taken(exp: successful login )
const flash = require('express-flash')
//enables session management in Express
const session = require('express-session')
//allows the use of HTTP verb DELETE in web forms (used for logout functionality)
const methodOverride = require('method-override')



const initialize = require('./passport-config')
initialize(
  passport,
  //getUserByEmail 
  async (email) => {
    try {
      await connect()
      const connection = await getConnection()
      const result = await connection.execute(
        'SELECT * FROM users WHERE email = :email',
        {email}
      )
      await closePool()
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
        console.log('getUserByEmail',user)
        return user
      }
    } catch (error) {
      console.error(error)
    }
  },
  //getUserById
  async (id) => {
    try {
      await connect()
      const connection = await getConnection()
      const result = await connection.execute(
        'SELECT * FROM users WHERE TO_NUMBER(id) = :id',
        {id}
      )
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
        console.log('getUserById',user)
        return user
      }
    } catch (error) {
      console.error(error)
    }
  }
)

//FOR CSS
app.use(express.static(__dirname + '/views'))
//set the view engine for our application to EJS (rendering dynamic HTML to client requests)
app.set('view-engine', 'ejs')
//Take data from the forms and build access to them inside our request variable in post method
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/index.css', getCSS)
app.get('/', checkAuthenticated, dashboard)
//display the login page
app.get('/login', checkNotAuthenticated, getLogin)
app.post('/login', checkNotAuthenticated, postLogin)
//display the register page
app.get('/register', checkNotAuthenticated, getRegister)
app.post('/register', checkNotAuthenticated, postRegister)
app.delete('/logout', logout)

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Gracefully shutdown the server on interrupt signals
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully')
  await closePool()
  process.exit(0)
})