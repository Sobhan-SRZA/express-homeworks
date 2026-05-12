import { NextFunction, Response } from "express";
import { RequestRouter } from "../types/requests";
import findAccount from "../db/account/findAccount";
import createAccount from "../db/account/createAccount";
import { generateToken, hashPassword } from "../utils/security";
import { UserTokenPlayload } from "../types/user";


export default (req: RequestRouter, res: Response, next: NextFunction) => {
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
        const existingUser = findAccount(username);
        if (existingUser) {
            return res
                .status(409) // Conflict
                .type("application/problem+json")
                .send({
                    title: "Username Taken",
                    message: "This username is already in use. Please choose another one.",
                    code: 409
                });
        }

        const hashedPassword = hashPassword(password);

        const user: UserTokenPlayload | null = createAccount(username, hashedPassword);
        if (!user) {
            throw "Faild to create a account."
        }

        const token = generateToken(user);

        res
            .status(201) // Created
            .type("application/json")
            .send({
                message: "User registered successfully!",
                code: 201,
                token: token
            });

        return;
    }

    catch (error) {
        console.error("Registration error:", error);
        res
            .status(500)
            .type("application/problem+json")
            .send({
                title: "Internal Server Error",
                message: "An unexpected error occurred during registration.",
                code: 500
            });

        return;
    }
};