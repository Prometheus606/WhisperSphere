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

    db.query("CREATE TABLE IF NOT EXISTS rooms ( \
        id SERIAL PRIMARY KEY, \
        creationdate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \
        password TEXT NOT NULL \
    )")

    db.query("CREATE TABLE IF NOT EXISTS messages ( \
        id SERIAL PRIMARY KEY, \
        creationdate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \
        message TEXT NOT NULL, \
        room_id INT NOT NULL, \
        username TEXT NOT NULL, \
        FOREIGN KEY (room_id) REFERENCES rooms(id) \
    )")

    req.db = db

    next()

}
