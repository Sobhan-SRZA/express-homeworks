import { UserTokenVerify } from "./user";
import { Request } from "express";
import { Socket } from "socket.io";

export interface RequestRouter extends Request {
    user?: UserTokenVerify;
}

export interface CustomSocket extends Socket {
    user?: UserTokenVerify;
}