export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, n = 2, aspect_ratio = "9:16" } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await fetch('https://api.x.ai/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-imagine-image-quality",
                prompt: prompt,
                n: n,
                aspect_ratio: aspect_ratio
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || 'Image generation failed' 
            });
        }

        const images = data.data.map(img => img.url);
        return res.status(200).json({ images });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
