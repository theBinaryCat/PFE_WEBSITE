if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes/test')
const { connect, close, getConnection } = require('./db/connect')
const app = express()
//hash and compare passwords
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')


connect()

const initialize = require('./passport-config')
initialize(
  passport,
  async (email) => {
    try {

      const connection = await getConnection()
      const result = await connection.execute(
        'SELECT * FROM users WHERE email = :email',
        {email}
      )
      await close();
      if (result.rows.length > 0) {
        const user = result.rows[0]
        console.log('test get user by email',user[3])
        return user
      }
    } catch (error) {
      console.error(error)
    }
  },
  
  async (id) => {
    try {
      const connection = await getConnection()
      const result = await connection.execute(
        'SELECT * FROM users WHERE TO_NUMBER(id) = :id',
        {id}
      )
      await close();
      if (result.rows.length > 0) {
        const user = result.rows[0]
        console.log('test get user by id',user)
        return user
      }
    } catch (error) {
      console.error(error)
    }
  }
)

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


app.get('/', (req, res) => {
  console.log(req.user)
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    //hash the password of the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //test
    console.log('hashedPassword:', hashedPassword);
    console.log('req.body.password:', req.body.password);
    console.log(Date.now())
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.password)
    const connection = await getConnection()
    //store the new user in our database
    await connection.execute(
      `INSERT INTO users (id, name, email, password) VALUES (${Date.now()}, '${req.body.name}', '${req.body.email}', '${hashedPassword}')`
    );
    await connection.execute(
      `commit`
    );
    await close();
    //if the registration is succefull, redirect to login page
    res.redirect('/login')
  } catch (e){
    console.error(e)
    //if the registration is failed, redirect to registration page
    res.redirect('/register')
  }
})

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Gracefully shutdown the server on interrupt signals
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully')
  await close()
  process.exit(0)
})