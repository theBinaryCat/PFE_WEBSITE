if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes/test')
const { getConnection, connect, closePool } = require('./db/connect')
const app = express()
//hash and compare passwords
const bcrypt = require('bcrypt')
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


app.get('/', checkAuthenticated, async (req, res) => {
  const user = await req.user
  console.log('the user name: ',user.name)
  res.render('index.ejs', { name: user.name })
})

//display the login page
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//display the register page
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated,async (req, res) => {
  try {
    //hash the password of the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //test
    console.log('hashedPassword:', hashedPassword);
    console.log('req.body.password:', req.body.password);
    console.log(Date.now())
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.password)
    await connect()
    const connection = await getConnection()
    //store the new user in our database
    await connection.execute(
      `INSERT INTO users (id, name, email, password) VALUES (${Date.now()}, '${req.body.name}', '${req.body.email}', '${hashedPassword}')`
    );
    await connection.execute(
      `commit`
    );
    await closePool();
    //if the registration is succefull, redirect to login page
    res.redirect('/login')
  } catch (e){
    console.error(e)
    //if the registration is failed, redirect to registration page
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  
  req.logout(function(err) {
    if(err) {
      console.log(err);
    }
    res.redirect('/login');
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
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