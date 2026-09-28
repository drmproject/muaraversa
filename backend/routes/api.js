import {
    getUsers
} from "../services/database.js";


export async function apiInfo(DB) {

    let users = [];

    if (DB) {

        users = await getUsers(DB);

    }

    return {

        name: "Muaraversa API",

        status: "active",

        database: DB ? "connected" : "not configured",

        users

    };

}


export async function databaseTest(DB) {

    if (!DB) {

        return {
            database: "not configured"
        };

    }

    const result = await DB
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all();

    return {
        database: "connected",
        tables: result.results || []
    };

}
