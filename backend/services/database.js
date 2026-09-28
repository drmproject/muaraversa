// Muaraversa Database Service


export async function getUsers(DB) {


    const result = await DB
        .prepare(
            "SELECT id, username, role FROM users"
        )
        .all();


    return result.results;

}
