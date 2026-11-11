const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be", "youtube-nocookie.com", "www.youtube-nocookie.com"]);

function extractVideoId(rawUrl) {
  let parsed;
  try { parsed = new URL(rawUrl); } catch { return null; }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (!YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase())) return null;
  let id = "";
  if (parsed.hostname.toLowerCase().includes("youtu.be")) id = parsed.pathname.split("/").filter(Boolean)[0] || "";
  else if (parsed.pathname === "/watch") id = parsed.searchParams.get("v") || "";
  else {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (["shorts", "embed", "live"].includes(parts[0])) id = parts[1] || "";
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const id = extractVideoId(req.body && req.body.url);
  if (!id) return res.status(400).json({ error: "Please provide a valid public YouTube video URL." });

  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    const upstream = await fetch(endpoint, { headers: { "Accept": "application/json" } });
    if (!upstream.ok) return res.status(422).json({ error: "Video details are unavailable. The video may be private, removed, or unsupported." });
    const info = await upstream.json();
    return res.status(200).json({
      id,
      title: info.title || "",
      author: info.author_name || "",
      thumbnail: info.thumbnail_url || "",
      provider: "YouTube oEmbed",
      downloadAvailable: false,
      message: "Public metadata only. No video or audio stream is provided by this endpoint."
    });
  } catch {
    return res.status(502).json({ error: "Could not reach the video information service. Please try again." });
  }
};