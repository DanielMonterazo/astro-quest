// Estudos reais do NASA OSDR (Open Science Data Repository) usados no minigame Laboratório.
// Busca título, organismo e missão de cada estudo na API pública de busca do OSDR (não precisa de chave).
// A resposta fica 1 dia no cache da Vercel.
const IDS = /^OSD-\d{1,5}$/;

function missao(m) {
  if (!m) return "";
  if (Array.isArray(m)) return m.map(missao).filter(Boolean).join(", ");
  if (typeof m === "object") return m.Name || m.name || "";
  return String(m);
}

module.exports = async (req, res) => {
  const ids = String((req.query && req.query.ids) || "").split(",").map(s => s.trim()).filter(s => IDS.test(s)).slice(0, 8);
  const estudos = {};
  await Promise.all(ids.map(async id => {
    try {
      const r = await fetch(`https://osdr.nasa.gov/osdr/data/search?term=${encodeURIComponent(id)}&type=cgene&size=5`);
      if (!r.ok) return;
      const j = await r.json();
      const h = ((j.hits && j.hits.hits) || []).map(x => x._source).find(s => s && s.Accession === id);
      if (h) estudos[id] = { titulo: h["Study Title"] || "", organismo: h.organism || "", missao: missao(h.Mission), programa: h["Flight Program"] || "" };
    } catch (e) {}
  }));
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).json({ fonte: "NASA OSDR", atualizado: new Date().toISOString(), estudos });
};
