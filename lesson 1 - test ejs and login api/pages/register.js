const {
    encodePassword,
    encodeAuthentication,
    encodeUsername
} = require("../utils/tokenise");
const checkUsername = require("../utils/checkUsername");

/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.post("/register", async (req, res, next) => {
        if (req.body.password && req.body.username) {
            const { username, password } = req.body

            if (await checkUsername(db, username)) {
                res
                    .status(401)
                    .type("application/problem+json")
                    .send({
                        title: "Usename is used before",
                        message: "The username you send is used before.",
                        code: 401
                    })

                return;
            }

            await db.set(`accounts.${encodeUsername(username)}`, {
                username,
                password: encodePassword(password)
            })

            res
                .status(200)
                .send({
                    message: "Your are registed now!",
                    token: encodeAuthentication(username, password),
                    code: 200
                })
        }

        else {
            res
                .status(400)
                .type("application/problem+json")
                .send({
                    title: "Didn't use parameters",
                    message: "Wrong usage!",
                    code: 400
                })
        }
    })
}