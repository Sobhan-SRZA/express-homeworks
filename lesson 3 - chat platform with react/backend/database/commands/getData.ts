import {
    DatabaseEntry,
    TableDataMap,
    Tables
} from "./types";
import { readFileSync } from "fs";
import tables from "./tables";

export default function getData<T extends Tables>(
    table: T
): DatabaseEntry<TableDataMap[T]>[];

export default function getData<T extends Tables>(
    table: T,
    id: string
): DatabaseEntry<TableDataMap[T]> | undefined;
export default function getData<T extends Tables>(
    table: T,
    id?: string
) {
    if (!tables.includes(table))
        throw "DB: wrong table name!";

    const filePath = `./database/${table}.json`;

    let parsed: DatabaseEntry<TableDataMap[T]>[];

    try {
        const file = readFileSync(filePath, "utf8");
        parsed = JSON.parse(file);
    }
    
    catch {
        parsed = [];
    }

    if (id !== undefined) {
        return parsed.find(entry => entry.id === id);
    }

    return parsed;
}