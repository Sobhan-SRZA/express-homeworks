import { CustomSocket } from "./requests";

export interface UserTokenVerify {
    username: string;
    id: string;
    created_at: number;
    expire: number;
}

export type UserTokenPlayload = Omit<UserTokenVerify, "expire">;

export type OnlineUsers = Map<string, CustomSocket>;