// import requirements
const express = require("express")
const session  = require("express-session")
const passport = require('passport');

// get environment variables
require("dotenv").config()

// create Server
const app = express()
app.set("view engine", "ejs")

// Middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static("public"))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

// connect the Database
app.use(require("./model/db"))

// Authentication
require('./middleware/passport');
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))
app.use("/room", require("./routes/room"))


// Start server
app.listen(process.env.PORT || 3000, () => console.log(`Server is Listening on http://localhost:${process.env.PORT || 3000}`))
