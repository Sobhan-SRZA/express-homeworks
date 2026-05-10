import {
    NextFunction,
    Response
} from "express";
import { RequestRouter } from "../types/requests";
import { verifyToken } from "../utils/security";

export default async function authenticateToken(req: RequestRouter, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res
            .status(401)
            .type("application/problem+json")
            .send({
                title: "Unauthorized",
                message: "Authentication token is required.",
                code: 401
            });
    }

    const userPayload = verifyToken(token);

    if (!userPayload || userPayload.expire < Date.now()) {
        return res
            .status(401)
            .type("application/problem+json")
            .send({
                title: "Unauthorized",
                message: "Invalid or expired token.",
                code: 401
            });
    }

    req.user = userPayload;
    next();
}