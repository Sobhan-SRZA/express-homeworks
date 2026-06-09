import {
    NextFunction,
    Response
} from "express";
import {
    generateToken,
    verifyPassword
} from "../utils/security";
import { UserTokenPlayload } from "../types/user";
import { RequestRouter } from "../types/requests";
import findAccount from "../db/account/findAccount";

export default async (req: RequestRouter, res: Response, next: NextFunction) => {
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

        const user: UserTokenPlayload = {
            id: account.id,
            created_at: account.created_at,
            username: account.username
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

    catch (e) {
        console.error("Login error:", e);

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