export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { destino, dataInicio, dataFim, perfil, preferencias, orcamento, restricoes } = req.body;

  const prompt = `... seu prompt ...`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você cria roteiros turísticos personalizados." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const jsonResponse = completion.choices[0].message.content;

    // Tente parsear JSON, se der erro, capture e retorne texto
    try {
      const json = JSON.parse(jsonResponse);
      res.status(200).json(json);
    } catch(parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      console.error("Resposta da API:", jsonResponse);
      res.status(500).json({ error: "Resposta da API não está no formato JSON esperado", detalhes: jsonResponse });
    }

  } catch (error) {
    console.error("Erro na chamada OpenAI:", error);
    res.status(500).json({ error: "Erro na chamada OpenAI", detalhes: error.message });
  }
}
