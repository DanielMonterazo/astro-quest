// Radiação medida pelo RAD do Curiosity na superfície de Marte (NASA OSDR RadLab), em médias por dia.
// O RadLab não libera chamadas direto do navegador (sem CORS), por isso o jogo pergunta por aqui.
// Uso: /api/radlab?ini=2017-09-05&fim=2017-09-18  (no máximo 31 dias; dados de 2015 a 2024)
// Os dados são históricos e não mudam: a resposta fica 1 dia no cache da Vercel.
const DATA = /^\d{4}-\d{2}-\d{2}$/;

module.exports = async (req, res) => {
  const q = req.query || {};
  const ini = String(q.ini || "2017-09-05"), fim = String(q.fim || "2017-09-18");
  const dias = (Date.parse(fim) - Date.parse(ini)) / 864e5;
  if (!DATA.test(ini) || !DATA.test(fim) || !(dias > 0 && dias <= 31)) {
    res.status(400).json({ erro: "datas inválidas (use AAAA-MM-DD, até 31 dias)" });
    return;
  }
  const url = `https://visualization.osdr.nasa.gov/radlab/api/?instrument_id=MSL-RAD-Surface&timestamp%3E=${ini}&timestamp%3C${fim}&absorbed_dose_rate&format=csv`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("RadLab respondeu " + r.status);
    const linhas = (await r.text()).trim().split("\n").slice(1);
    const soma = {}, n = {};
    for (const l of linhas) {
      const c = l.split(","), d = c[0].replace(/"/g, "").slice(0, 10), v = parseFloat(c[2]);
      if (!DATA.test(d) || !isFinite(v)) continue;
      soma[d] = (soma[d] || 0) + v; n[d] = (n[d] || 0) + 1;
    }
    const serie = Object.keys(soma).sort().map(d => ({ data: d, dose: +(soma[d] / n[d]).toFixed(2) }));
    if (!serie.length) throw new Error("sem medições nesse período");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({ fonte: "NASA OSDR RadLab · MSL-RAD (Curiosity)", unidade: "µGy/h", serie });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ erro: String(e.message || e) });
  }
};
