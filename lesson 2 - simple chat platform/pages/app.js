/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = async (app) => {
    app.get("/app", (req, res) => {
        res.render("app")
    })

    app.get("/chat/:username", (req, res) => {
        res.render("app")
    })
}