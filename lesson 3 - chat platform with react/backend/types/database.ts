import tables from "../database/commands/tables";

export type Tables = typeof tables[number];

export interface Account {
    created_at: number;
    username: string;
    id: string;
    password: string;
}

export interface Message { }
export interface User { }
export interface Chat { }
export interface File { }

export interface Database {
    id: string;
    value: object | Account | Message | User | Chat | File;
}