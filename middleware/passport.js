const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const settings = {
    usernameField: "roomID",
    passwordField: "password",
    passReqToCallback: true
}

passport.use(new LocalStrategy(settings, async function(req, roomID, password, cb) {
    try {
        const result = await req.db.query("SELECT * FROM rooms WHERE id=$1", [roomID]);

        if (result.rows.length !== 1) return cb(null, false); // Make sure to return cb here

        const room = result.rows[0];
    
        const isValid = await bcrypt.compare(password, room.password);

        room.userName = req.body.userName
        if (isValid) return cb(null, room);
        else return cb(null, false);

    } catch (error) {
        return cb(error);
    }

}));


passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((user, cb) => {
   cb(null, user)
})