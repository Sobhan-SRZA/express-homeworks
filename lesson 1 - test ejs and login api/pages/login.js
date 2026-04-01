const {
    encodePassword,
    encodeAuthentication,
    encodeUsername
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

            const account = await db.get(`accounts.${encodeUsername(username)}`);
            if (account) {
                if (account.password === encodePassword(password)) {
                    res
                        .status(200)
                        .send({
                            message: "Your are loginned now",
                            token: encodeAuthentication(username, password),
                            code: 200
                        })

                    return;
                }

                else {
                    res
                        .status(401)
                        .type("application/problem+json")
                        .send({
                            title: "Invalid Password",
                            message: "The body password parameter is wrong so you can't loggin to your profile.",
                            code: 401
                        })

                    return;
                }
            }

            else {
                res
                    .status(401)
                    .type("application/problem+json")
                    .send({
                        title: "Not Registed",
                        message: "This username is not registed in system.",
                        code: 401
                    })

                return;
            }
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

            return;
        }
    })
}