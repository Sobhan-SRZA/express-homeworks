const { verifyPassword, generateToken } = require("../utils/security");
const findAccount = require("../db/account/findAccount");

module.exports = async (req, res, next) => {
    if (!req.body.password || !req.body.username) {
        return res
            .status(400)
            .type("application/problem+json")
            .send({
                title: "Missing parameters",
                message: "Username and password are required.",
                code: 400
            });
    }

    const { username, password } = req.body;

    try {
        const account = findAccount(username);

        if (!account) {
            return res
                .status(401)
                .type("application/problem+json")
                .send({
                    title: "Not Registered",
                    message: "This username is not registered in the system.",
                    code: 401
                });
        }

        const isPasswordValid = verifyPassword(account.password, password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .type("application/problem+json")
                .send({
                    title: "Invalid Password",
                    message: "The password you provided is incorrect.",
                    code: 401
                });
        }

        const user = {
            id: account.id,
            created_at: account.created_at,
            username: account.username,
        };
        
        const token = generateToken(user);

        res
            .type("application/json")
            .status(200)
            .send({
                message: "You are logged in now!",
                token: token,
                code: 200
            });

    }

    catch (error) {
        console.error("Login error:", error);

        res
            .status(500)
            .type("application/problem+json")
            .send({
                title: "Internal Server Error",
                message: "An unexpected error occurred during login.",
                code: 500
            });
    }
};