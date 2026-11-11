module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  return res.status(501).json({
    error: "No authorized media-download provider is configured.",
    explanation: "YouTube's public metadata endpoint does not provide downloadable media streams. Connect a provider that explicitly authorizes the requested download before enabling this route."
  });
};