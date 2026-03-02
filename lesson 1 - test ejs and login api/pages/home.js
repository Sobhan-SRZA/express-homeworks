/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.get("/", (req, res) => {
        req.app.prototype
        console.log("🚀 ~ req.app.prototype:", req.app.prototype)

        res.render("index", {
            req: req,
            is_login: true
        })
    })
}