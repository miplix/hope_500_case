export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { contract, token_ids } = req.body;
  const apikey = process.env.SENDLER_API_KEY;
  if (!contract || !token_ids?.length) return res.status(400).json({ error: 'Missing params' });
  if (!apikey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const r = await fetch(
      `https://api.sendler.xyz/nft/by-token-ids/?contract_address=${encodeURIComponent(contract)}`,
      {
        method: 'POST',
        headers: { 'accept': 'application/json', 'X-API-Key': apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_ids })
      }
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
