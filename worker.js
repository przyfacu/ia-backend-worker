export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const { text } = await request.json();

    const prompt = `
Sos una IA asistente.
Analizá el texto y explicá brevemente de qué trata.

Texto:
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
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const data = await groqRes.json();
    const reply = data.choices[0].message.content;

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
