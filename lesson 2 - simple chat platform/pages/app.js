/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.get("/app", (req, res) => {
        res.render("app")
    })

    app.get("/chat/:username", (req, res) => {
        res.render("chats/index")
    })
}