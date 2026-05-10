import { UserTokenVerify } from "./user";
import { Request } from "express";

export interface RequestRouter extends Request{
    user?: UserTokenVerify;
}