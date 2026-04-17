/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = async (app) => {
    app.get("/", (req, res) => {
        res.render("index")
    })
}