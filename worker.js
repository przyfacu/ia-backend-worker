export default {
  async fetch(request, env) {
    return new Response(
      JSON.stringify({
        ok: true,
        hasKey: !!env.GROQ_API_KEY
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
