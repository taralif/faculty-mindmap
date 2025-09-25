export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { type, profile, topic, node } = req.body;
  
  try {
    const prompt = type === 'nodes' ? 
      `Generate 3 teaching nodes for topic "${topic}" based on: ${JSON.stringify(profile)}. Return JSON with "nodes" array.` :
      `Generate 3 activities for "${node.label}" and topic "${topic}". Return JSON with "activities" array.`;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    
    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}
