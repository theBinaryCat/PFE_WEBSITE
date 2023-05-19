if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const oracledb = require('oracledb')
// Set the queueTimeout value
oracledb.queueTimeout = 120000;
const {connect, closePool } = require('./db/connect')
const auth = require('./routes/authentication')

//authentication middleware 
const passport = require('passport')
//display a message to the user after an action has been taken(exp: successful login )
const flash = require('express-flash')
//enables session management in Express
const session = require('express-session')
//allows the use of HTTP verb DELETE in web forms (used for logout functionality)
const methodOverride = require('method-override')

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
//use the authentication routes
app.use('/auth',auth)

// Start the server
const start = async() => {
  try{
      await connect()
      app.listen(port,()=>{console.log(`Server is listening on port ${port} ...`)})
  } catch(error){
      console.log(error)
  }
}
start()

// Gracefully shutdown the server on interrupt signals
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully')
  await closePool()
  process.exit(0)
})