const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
//initialize our server   
function initialize(passport,getUserByEmail, getUserById) {
    //authenticate the use using his email and password for login
    const authenticateUser = async (email, password, done) => {
        //get the user from the data base with the entred email
        const user = await getUserByEmail(email)
        //test 
        console.log('the user is',user)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }
        try {
            //compare the entred password with the existing one
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
        } else {
            return done(null, false, { message: 'Password incorrect' })
        }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize