import {
    DatabaseEntry,
    TableDataMap,
    Tables
} from "./types";
import { writeFileSync } from "fs";
import getData from "./getData";
import tables from "./tables";

export default function <T extends Tables>(table: T, data: DatabaseEntry<TableDataMap[T]> | DatabaseEntry<TableDataMap[T]>[], id?: string) {
    if (!tables.includes(table))
        throw Error("DB: wrong table name!")

    if (id && !Array.isArray(data)) {
        let allData = getData(table);
        if (!Array.isArray(allData)) {
            throw `DB Error: the ${table} data is not array!`;
        }

        allData = allData.filter(a => a.id !== (data as DatabaseEntry<TableDataMap[T]>).id)

        allData.push(data);

        data = allData;
    }

    writeFileSync(`./database/${table}.json`, JSON.stringify(data, undefined, 4));

    return data as DatabaseEntry<TableDataMap[T]>[];
}