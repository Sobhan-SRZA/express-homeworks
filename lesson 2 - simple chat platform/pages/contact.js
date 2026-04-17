/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = async (app) => {
    app.get("/contact", (req, res) => {
        res.render("contact")
    })
}