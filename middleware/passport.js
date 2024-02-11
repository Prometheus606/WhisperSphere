const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const customFields = {
    usernameField: "RoomID",
    passwordField: "password"
}

const verifyCallback = async (roomID, password, cb) => {
    try {
        const result = await db.query("SELECT * FROM rooms WHERE id=$1", [roomID])

        if (result.rows.length !== 1) cb(null, false)

        const room = result.rows[0]
    
        const isValid = bcrypt.compare(password, room.password)
    
        if (isValid) return cb(null, room)
            else return cb(null, false)

    } catch (error) {
        return cb(error)
    }

}

const localStrategy = new LocalStrategy(customFields, verifyCallback)
passport.use(localStrategy)

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((user, cb) => {
   cb(null, user)
})