import {
    getUsers
} from "../services/database.js";



export async function apiInfo(DB) {


    const users =
    await getUsers(DB);



    return {

        name:
        "Muaraversa API",

        status:
        "active",

        users

    };


}
