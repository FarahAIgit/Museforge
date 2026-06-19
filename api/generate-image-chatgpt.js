import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, n } = req.body;

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt,
      n: n || 1,
      size: "1024x1024"
    });

    const images = result.data.map(img => img.url);

    res.status(200).json({ images });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
