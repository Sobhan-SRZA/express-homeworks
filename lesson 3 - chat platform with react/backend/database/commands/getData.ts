import { readFileSync } from "fs";
import { Database, Tables } from "../../types/database";
import tables from "./tables";


export default function (table: Tables, id?: string) {
    if (!tables.includes(table))
        throw Error("DB: wrong table name!")

    let data: Database[] | Database;
    try {
        data = JSON.parse(readFileSync(`./database/${table}.json`).toString("utf8")) as Database[];

        if (id) {
            const foundedId = data.find(a => a.id === `${id}`);
            if (foundedId)
                data = foundedId as Database;
        }
    }

    catch {
        data = []
    }

    return data
}