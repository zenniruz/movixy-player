// Vercel serverless function — returns all available provider embed URLs for a title
// GET /api/sources?tmdb=550&type=movie
// GET /api/sources?tmdb=1396&type=tv&s=1&e=1

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { tmdb, id, type = "movie", s = "1", e = "1" } = req.query;
  const tmdbId = tmdb || id;

  if (!tmdbId) {
    return res.status(400).json({ error: "tmdb param required" });
  }

  const season  = parseInt(s)  || 1;
  const episode = parseInt(e)  || 1;
  const isTV    = type.toLowerCase() === "tv";

  const providers = isTV ? [
    { name: "AutoEmbed",  url: `https://autoembed.co/tv/tmdb/${tmdbId}/${season}/${episode}` },
    { name: "VidSrc",     url: `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}` },
    { name: "VidLink",    url: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=7c3aed&secondaryColor=a855f7&iconColor=fff&autoplay=true` },
    { name: "2Embed",     url: `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}` },
    { name: "EmbedSu",    url: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}` },
    { name: "VidSrc.me",  url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}` },
  ] : [
    { name: "AutoEmbed",  url: `https://autoembed.co/movie/tmdb/${tmdbId}` },
    { name: "VidSrc",     url: `https://vidsrc.to/embed/movie/${tmdbId}` },
    { name: "VidLink",    url: `https://vidlink.pro/movie/${tmdbId}?primaryColor=7c3aed&secondaryColor=a855f7&iconColor=fff&autoplay=true` },
    { name: "2Embed",     url: `https://www.2embed.cc/embed/${tmdbId}` },
    { name: "EmbedSu",    url: `https://embed.su/embed/movie/${tmdbId}` },
    { name: "VidSrc.me",  url: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}` },
  ];

  res.setHeader("Cache-Control", "public, s-maxage=300");
  return res.status(200).json({ tmdb_id: tmdbId, type, season: isTV ? season : null, episode: isTV ? episode : null, providers });
}
