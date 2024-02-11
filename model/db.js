module.exports = (req, res, next) => {

    const pg = require("pg")

    const db = new pg.Client({
        user: process.env.PG_USER,
        password: process.env.PG_PW,
        port: process.env.PG_PORT,
        database: process.env.PG_DB,
        host: process.env.PG_HOST
    })
    db.connect()

    req.db = db

    next()

}
