const router = require("express").Router();
const bcrypt = require("bcrypt")
const CryptoJS = require('crypto-js');

router.get("/", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")

    const db = req.db
    const roomID = req.user.id
    const password = req.user.password

    try {
        let result = await db.query("SELECT * FROM messages WHERE room_id=$1 ORDER BY creationdate ASC", [roomID])

        const messages = []
        let messagesOnSameDay = []
        let date = "";
        result.rows.forEach(row => {

            const decryptedBytes = CryptoJS.AES.decrypt(row.message, password);
            const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

            // Datum formatieren (10.02.2024)
            const formattedDate = row.creationdate.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            
            // Uhrzeit formatieren (18:30)
            const formattedTime = row.creationdate.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            });

            if (date === "") {
                date = formattedDate
            }

            if (formattedDate !== date && messagesOnSameDay.length > 0) {
                console.log("jo");
                messages.push(messagesOnSameDay)
                messagesOnSameDay = []
                date = formattedDate
            }

            messagesOnSameDay.push({
                messageID: row.id,
                roomID: row.room_id,
                creationDate: formattedDate,
                creationTime: formattedTime,
                text: decryptedMessage,
                userName: row.username
            })
            
        });

        messages.push(messagesOnSameDay)

        res.render("room", {
            success: true,
            roomID,
            messages
        })

    } catch (error) {
        console.log(error);
        res.render("index", {error: "Error get Messages."})
    }
})

router.post("/", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")

    const db = req.db
    const roomID = req.user.id
    const password = req.user.password
    const message = req.body.message
    const userName = req.user.userName

    try {
        const encryptedMessage = CryptoJS.AES.encrypt(message, password).toString();
        await db.query("INSERT INTO messages (room_id, message, username) VALUES ($1, $2, $3)", [roomID, encryptedMessage, userName])
    
        res.redirect(`/room`)

    } catch (error) {
        console.log(error);
        res.render("index", {error: "Error sending Message."})
    }
})

router.post("/delete", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/")
    
    const db = req.db
    const roomID = req.user.id

    try {
        await db.query("DELETE FROM messages WHERE room_id=$1", [roomID])
        await db.query("DELETE FROM rooms WHERE id=$1", [roomID])

        res.render("index", {
            error: `Successful deleted room ${roomID}.`
        })
    } catch (error) {
        console.log(error);
        res.render("index", {error: "Error deleting room."})
    }
})

module.exports = router