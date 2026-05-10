import { writeFileSync } from "fs";
import {
    Database,
    Tables
} from "../../types/database";
import getData from "./getData";
import tables from "./tables";

export default function (table: Tables, data: Database[] | Database, id: string) {
    if (!tables.includes(table))
        throw Error("DB: wrong table name!")

    if (id && !Array.isArray(data)) {
        let allData = getData(table) as Database[];

        allData = allData.filter(a => a.id !== (data as Database).id)

        allData.push(data);

        data = allData;
    }

    writeFileSync(`./database/${table}.json`, JSON.stringify(data, undefined, 4));

    return data;
}