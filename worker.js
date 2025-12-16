export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const { text = "" } = await request.json();

const prompt = `
Sos una IA asistente.
Respondé SOLO JSON válido.

Si el contenido es informativo, generá una presentación.

Formato:

{
  "accion": "crear_presentacion",
  "parametros": {
    "titulo": "...",
    "slides": [
      {
        "titulo": "...",
        "contenido": ["...", "..."]
      }
    ]
  }
}

Tema:
${text.slice(0, 2000)}
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
