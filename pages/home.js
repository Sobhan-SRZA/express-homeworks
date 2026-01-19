/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.get("/", (req, res) => {
        res.render("index", {
            req: req,
            is_login: true
        })
    })
}