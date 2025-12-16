export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400 }
      );
    }

    const text = body.text || "";

    const prompt =
      "Sos una IA asistente.\n" +
      "Analizá el siguiente texto y explicá brevemente de qué trata:\n\n" +
      text.slice(0, 3000);

    let groqResponse;
    try {
      groqResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              { role: "user", content: prompt }
            ]
          })
        }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Error al conectar con Groq" }),
        { status: 500 }
      );
    }

    let data;
    try {
      data = await groqResponse.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Respuesta inválida de Groq" }),
        { status: 500 }
      );
    }

    const reply =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content
        : "No se pudo generar respuesta";

    return new Response(
      JSON.stringify({
        status: "ok",
        respuesta: reply
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
