// import requirements
const express = require("express")
const session  = require("express-session")
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// get environment variables
require("dotenv").config()

// create Server
const app = express()
app.set("view engine", "ejs")

// Middleware

// Middleware to limit requests per IP address
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum number of requests per IP
    handler: function (req, res, next) {
      res.status(429).render("error", {
        code: 429,
        error: 'Too many requests from this IP address. Please try again later.'
      });
    }
  });

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static("public"))

if (process.env.NODE_ENV === 'production') app.use(limiter);
  else app.use(morgan('dev'))

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


// Middleware for custom error handling for not found routes
app.use((req, res, next) => {
  res.status(404).render("error", {
    code: 404,
    error: 'Sorry, the page was not found!'
  });
});

// Middleware for general error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    code: 500,
    error: 'Something went wrong!'
  });
});


// Start server
app.listen(process.env.PORT || 3000, () => console.log(`Server is Listening on http://localhost:${process.env.PORT || 3000}`))
