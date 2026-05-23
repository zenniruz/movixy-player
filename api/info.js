// Vercel serverless function — returns TMDB movie/TV info
// Env var required: TMDB_API_KEY

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tmdb, id, type = "movie" } = req.query;
  const tmdbId = tmdb || id;

  if (!tmdbId) {
    return res.status(400).json({ error: "tmdb param required" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY not configured" });
  }

  const endpoint = type === "tv"
    ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=en-US`
    : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`;

  try {
    const upstream = await fetch(endpoint);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "TMDB returned an error" });
    }
    const data = await upstream.json();
    // Cache for 1 hour
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to reach TMDB", detail: String(err) });
  }
}
