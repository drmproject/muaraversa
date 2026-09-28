// Muaraversa Response Helper


export function jsonResponse(
    data,
    status = 200
) {

    return new Response(

        JSON.stringify(data),

        {
            status,

            headers: {

                "Content-Type":
                "application/json",

                "Access-Control-Allow-Origin":
                "*",

                "Access-Control-Allow-Methods":
                "GET,POST,PUT,DELETE,OPTIONS"

            }
        }

    );

}


export function errorResponse(
    message,
    status = 500
) {

    return jsonResponse(

        {
            success:false,
            error:message
        },

        status

    );

}
