export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const { text = "" } = await request.json();

    const prompt = `
Sos una IA asistente que devuelve SOLO JSON válido.
No escribas texto fuera del JSON.

Analizá el contenido y respondé en este formato:

{
  "accion": "resumir_pagina",
  "parametros": {
    "resumen": "..."
  }
}

Contenido:
${text.slice(0, 3000)}
`;


    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      }
    );

    const data = await groqRes.json();

    const reply =
      data.choices?.[0]?.message?.content ??
      data.error?.message ??
      "Sin respuesta";

    return new Response(
      JSON.stringify({ respuesta: reply }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
