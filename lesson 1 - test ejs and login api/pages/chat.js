/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {

    app.get("/chat", async (req, res) => {

        const messages = (await db.get("messages")) || [];

        const { message } = req.query;

        if (message) {
            await db.push("messages", {
                id: (messages.length || 0) + 1,
                message: message,
                user: "sobhan"
            })

            res.redirect("/chat")
        }

        else {
            res.render("chat", {
                req: req,
                messages:messages
            })
        }
    })

}