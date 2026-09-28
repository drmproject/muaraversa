export default {
  async fetch(request, env) {

    return new Response(
      "Muaraversa Backend Running",
      {
        headers:{
          "content-type":"text/plain"
        }
      }
    );

  }
};
