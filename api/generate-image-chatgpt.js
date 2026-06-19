export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, n = 2 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "dall-e-3",           // ← Changed to dall-e-3
                prompt: prompt,
                n: n,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI Error:", data);
            return res.status(response.status).json({
                error: data.error?.message || 'Image generation failed'
            });
        }

        // dall-e-3 returns URLs
        const images = data.data.map(img => img.url);

        return res.status(200).json({ images });

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
