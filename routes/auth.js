const router = require("express").Router();
const passport = require('passport');

// log out
router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
      });
      res.redirect("/")
})

// login failure route
router.get("/loginFailure", (req, res, next) => {
    req.session.joinError = "Cannot find room or Password and room ID does not match."
    res.redirect("/")
})

// login route
router.post("/login", passport.authenticate("local", {
    failureRedirect: '/auth/loginFailure',
    passReqToCallback: true
    
}), (req, res) => {
    res.redirect(`/room/${req.body.roomID}`)
})

module.exports = router