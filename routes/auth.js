const router = require("express").Router();
const bcrypt = require("bcrypt")
const passport = require('passport');

router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
      });
      res.redirect("/")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: '/room',
    failureRedirect: '/'
}))

router.post("/register", async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.pw, 10)

    let lastId
    if (users.length > 0) {
        lastId = users[users.length - 1].id
    } else {
        lastId = 0
    }
    
    users.push({
        id: lastId + 1,
        username: req.body.uname,
        password: passwordHash
    })

    console.log(users);
    res.redirect("/login")
})

module.exports = router