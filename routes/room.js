const router = require("express").Router();
const bcrypt = require("bcrypt")
const CryptoJS = require('crypto-js');
const generatePassword = require("../utils/randomKey")

router.get("/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")

    const db = req.db
    const roomID = req.params.id
    const password = req.body.password

    try {
        let result = await db.query("SELECT * FROM rooms WHERE id=$1", [roomID])

        if (result.rows.length !== 1) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        let room = result.rows[0]

        const isValid = await bcrypt.compare(password, room.password)

        if (!isValid) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        result = await db.query("SELECT * FROM messages WHERE room_id=$1", [roomID])

        const messages = []
        result.rows.forEach(row => {

            const decryptedBytes = CryptoJS.AES.decrypt(row.message, password);
            const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

            messages.push({
                messageID: row.id,
                roomID: row.room_id,
                creationDate: row.creationdate,
                message: decryptedMessage
            })
        });

        res.json({
            success: true,
            roomID,
            messages
        })

    } catch (error) {
        console.log(error);
        res.json({error: "Error get Messages."})
    }
})

router.post("/new", async (req, res) => {
    const db = req.db
    console.log(req.body);
    let password = req.body.password
    if (!password) {
        password = generatePassword(Math.floor((Math.random() * 8) + 12))
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await db.query("INSERT INTO rooms (password) VALUES ($1) RETURNING *", [passwordHash])

        res.json({
            success: true,
            room: result.rows[0].id,
            creationDate: result.rows[0].creationdate,
            password,
            message: "Save the Password! It is not stored anywhere."
        })
    } catch (error) {
        console.log(error);
        res.json({success:false, error: "Error creating room."})
    }
})

router.post("/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")

    const db = req.db
    const roomID = req.params.id
    const password = req.body.password
    const message = req.body.message

    try {
        let result = await db.query("SELECT * FROM rooms WHERE id=$1", [roomID])

        if (result.rows.length !== 1) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        let room = result.rows[0]

        const isValid = await bcrypt.compare(password, room.password)

        if (!isValid) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        const encryptedMessage = CryptoJS.AES.encrypt(message, password).toString();
        await db.query("INSERT INTO messages (room_id, message) VALUES ($1, $2)", [roomID, encryptedMessage])
    
        res.redirect(`/room/${roomID}`)

    } catch (error) {
        console.log(error);
        res.json({error: "Error sending Message."})
    }
})

router.delete("/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")
    
    const db = req.db
    const roomID = req.params.id
    const password = req.body.password

    try {
        let result = await db.query("SELECT * FROM rooms WHERE id=$1", [roomID])

        if (result.rows.length !== 1) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        let room = result.rows[0]

        const isValid = await bcrypt.compare(password, room.password)

        if (!isValid) return res.json({success:false, error: "Cannot find room or Password and room ID does not match."})

        await db.query("DELETE FROM messages WHERE room_id=$1", [roomID])
        await db.query("DELETE FROM rooms WHERE id=$1", [roomID])

        res.json({
            success: true,
            message: `Successful deleted room ${room.id}.`
        })
    } catch (error) {
        console.log(error);
        res.json({error: "Error deleting room."})
    }
})

module.exports = router