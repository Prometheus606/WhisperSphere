const router = require("express").Router()

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/1", (req, res) => {
    res.send("fail")
})

router.get("/2", (req, res) => {
    res.send("loged in")
})

module.exports = router