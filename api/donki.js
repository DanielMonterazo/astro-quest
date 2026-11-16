// Clima espacial ao vivo (NASA DONKI), dos últimos 30 dias.
// A chave fica só no servidor: variável de ambiente NASA_API_KEY na Vercel (sem ela, usa a DEMO_KEY, com limite baixo).
// A resposta fica guardada 1 hora no cache da Vercel, então todos os jogadores juntos fazem no máximo ~24 pedidos por dia.
const TIPOS = new Set(["FLR", "CME", "SEP", "GST", "IPS", "RBE", "HSS", "MPC"]);

function resumo(corpo) {
  const m = /## Summary:\s*([\s\S]*?)(\n## |\nLinks to|$)/.exec(corpo || "");
  return (m ? m[1] : "").replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim().slice(0, 400);
}

module.exports = async (req, res) => {
  const chave = process.env.NASA_API_KEY || "DEMO_KEY";
  const fim = new Date(), ini = new Date(fim.getTime() - 30 * 864e5);
  const d = x => x.toISOString().slice(0, 10);
  const url = `https://api.nasa.gov/DONKI/notifications?startDate=${d(ini)}&endDate=${d(fim)}&type=all&api_key=${encodeURIComponent(chave)}`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error("DONKI respondeu " + r.status);
    const lista = await r.json();
    const eventos = (Array.isArray(lista) ? lista : [])
      .filter(m => TIPOS.has(m.messageType))
      .map(m => {
        const s = resumo(m.messageBody), v = /speed:\s*~?\s*(\d+)\s*km\/s/i.exec(s), c = /\b([XMC]\d+(?:\.\d+)?)\b/.exec(s);
        return { tipo: m.messageType, data: (m.messageIssueTime || "").slice(0, 10), url: m.messageURL, vel: v ? +v[1] : null, classe: m.messageType === "FLR" && c ? c[1] : null, resumo: s };
      })
      .sort((a, b) => (a.data < b.data ? 1 : -1))
      .slice(0, 20);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ fonte: "NASA DONKI (CCMC)", atualizado: new Date().toISOString(), eventos });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ erro: String(e.message || e) });
  }
};
