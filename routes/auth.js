const router = require("express").Router();
const bcrypt = require("bcrypt")
const passport = require('passport');
const generatePassword = require("../utils/randomKey")

router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
      });
      res.redirect("/")
})

router.get("/loginFailure", (req, res, next) => {
    res.render("index", {
        error: "Cannot find room or Password and room ID does not match."
    })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: '/room',
    failureRedirect: '/auth/loginFailure'
}))

router.post("/register", async (req, res) => {
    const db = req.db
    let password = req.body.password

    if (!password) {
        password = generatePassword(Math.floor((Math.random() * 8) + 12))
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await db.query("INSERT INTO rooms (password) VALUES ($1) RETURNING *", [passwordHash])

        res.render("newRoom", {
            success: true,
            roomID: result.rows[0].id,
            creationDate: result.rows[0].creationdate,
            password,
            message: "Save the Password! It is not stored anywhere."
        })
    } catch (error) {
        console.log(error);
        res.render("newRoom", {success:false, error: "Error creating room."})
    }
})

module.exports = router