/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {

    app.post("/send", async (req, res) => {

        if (req.body.id && req.body.user) {
            const { id, user, message, reply } = req.body

            await db.set(`message.${id}`, {
                message,
                user,
                reply
            })

            res.status(200).send({ message: "آی ساغول", code: 200 })
        }

        else {
            res.status(400).send({ message: "سیشدون", code: 400 })
        }
    })

}