// import requirements
const express = require("express")
const session  = require("express-session")
const passport = require('passport');
const morgan = require('morgan');

// get environment variables
require("dotenv").config()

// setup Server
const app = express()
app.set("view engine", "ejs")

// Middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static("public"))

// use ether a IP limter (in Production), or use morgan logging
if (process.env.NODE_ENV === 'production') app.use(require("./middleware/limiter"));
  else app.use(morgan('dev'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))


// Datebase
app.use(require("./model/db").connectDB) // Connect to the Database
app.use(require("./model/db").disconnectDB) // Disconnects from DB after res send


// Authentication
require('./middleware/passport');
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))
app.use("/room", require("./routes/room"))


// use error handler
app.use(require("./middleware/errorHandler"))


// Start server
app.listen(process.env.PORT || 3000, () => console.log(`Server is Listening on http://localhost:${process.env.PORT || 3000}`))
