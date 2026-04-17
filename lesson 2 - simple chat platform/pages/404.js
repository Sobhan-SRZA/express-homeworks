/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = async (app) => {
    app.get("/404", (req, res) => {
        res.render("404")
    })
}