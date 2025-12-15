export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const body = await request.json();
    const text = body.text || "";

    return new Response(
      JSON.stringify({
        status: "ok",
        mensaje: "Backend funcionando",
        preview: text.slice(0, 200)
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
