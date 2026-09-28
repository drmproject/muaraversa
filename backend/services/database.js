// Muaraversa Database Service


export async function getUsers(DB) {

    if (!DB) {

        return [];

    }

    const result = await DB
        .prepare(
            "SELECT id, username, role FROM users"
        )
        .all();


    return result.results || [];

}
