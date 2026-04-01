const {
    encodeUsername,
    decodeAuthentication
} = require("../utils/tokenise");

/**
 * 
 * @param {import("express").Express} app 
 * @param {import("quick.db").QuickDB} db
 */
module.exports = async (app, db) => {
    app.post("/authentication", async (req, res, next) => {
        if (req.body.token) {
            const { token } = req.body;

            if (!token) {
                res
                    .status(400)
                    .type("application/problem+json")
                    .send({
                        title: "Wrong usage!",
                        message: "Didn't use parameters. Send 'token' parameter in body.",
                        code: 400
                    })

                return;
            }

            const { username, password, timestamp } = decodeAuthentication(token);

            if (Date.now() > timestamp) {
                res
                    .status(401)
                    .type("application/problem+json")
                    .send({
                        title: "Not Logginned",
                        message: "Please login again. The authentication id is invalid.",
                        code: 401
                    })

                return;
            }

            const account = await db.get(`accounts.${encodeUsername(username)}`);
            if (account) {
                if (account.password === password) {
                    res
                        .status(200)
                        .send({
                            message: "Your are loginned.",
                            username,
                            created_at: account.created_at,
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