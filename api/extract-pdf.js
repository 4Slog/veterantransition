export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { pages } = req.body; // array of base64 JPEG strings
  if (!pages || !pages.length) return res.status(400).json({ error: 'No pages provided' });

  const content = [
    {
      type: 'text',
      text: 'These are pages from a U.S. military evaluation or service document (NCOER, OER, DA Form, Soldier Talent Profile, or similar). Extract ALL meaningful text content including: name, rank, MOS/PMOS, unit description, duty title, daily duties and scope, areas of special emphasis, appointed duties, performance bullet comments, rater/senior rater comments, counseling dates, award citations, training courses, and any other filled-in text. Skip blank fields and unchecked boxes. Preserve section structure with clear labels. Return only the extracted text — no commentary.'
    },
    ...pages.map(b64 => ({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: b64 }
    }))
  ];

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content }]
    })
  });

  const data = await resp.json();
  if (!resp.ok) return res.status(resp.status).json(data);
  res.json({ text: data.content[0].text });
}
