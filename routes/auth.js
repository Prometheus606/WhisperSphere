const router = require("express").Router();
const passport = require('passport');


router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
      });
      res.redirect("/")
})

router.get("/loginFailure", (req, res, next) => {
    req.session.joinError = "Cannot find room or Password and room ID does not match."
    res.redirect("/")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: '/room',
    failureRedirect: '/auth/loginFailure'
}))

module.exports = router