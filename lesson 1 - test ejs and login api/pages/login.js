const {
    encodePassword,
    encodeAuthentication
} = require("../utils/tokenise");

/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.post("/login", async (req, res, next) => {
        if (req.body.password && req.body.username) {
            const { username, password } = req.body

            const account = await db.get(`accounts.${username}`);
            if (account && (account.password === encodePassword(password)))
                res
                    .status(200)
                    .send({
                        message: "Your are loginned now",
                        token: encodeAuthentication(username, password),
                        code: 200
                    })

            else
                res
                    .status(401)
                    .type("application/problem+json")
                    .send({
                        title: "Invalid Body Input",
                        message: "The body password parameter is wrong so you can't loggin to your profile.",
                        code: 401
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