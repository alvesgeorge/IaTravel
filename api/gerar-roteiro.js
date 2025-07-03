// api/gerar-roteiro.js
import OpenAI from "openai";
const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { destino, dataInicio, dataFim, perfil, preferencias, orcamento, restricoes } = req.body;

  const prompt = `
Você é um assistente especializado em roteiros turísticos. Gere um roteiro em formato JSON com o seguinte schema:

{
  "itinerario": [
    {
      "dia": 1,
      "actividades": [
        {
          "horario": "string",
          "local": "string",
          "descrição": "string",
          "custo_aproximado": "string",
          "transporte": "string",
          "duração": "string",
          "foto_url": "string"
        }
      ]
    }
  ]
}

Informações da viagem:
Destino: ${destino}
Datas: ${dataInicio} a ${dataFim}
Perfil dos viajantes: ${perfil}
Preferências: ${preferencias}
Orçamento: ${orcamento}
Restrições: ${restricoes}

Responda SOMENTE com o JSON no formato especificado.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Você cria roteiros turísticos personalizados." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3
  });

  const jsonResponse = completion.choices[0].message.content;
  res.status(200).json(JSON.parse(jsonResponse));
}
