// Fotos mais recentes do rover Curiosity (imagens brutas públicas da NASA/JPL-Caltech), em cache por 1 hora.
const CAMERAS = [["MAST_LEFT", "Mastcam"], ["NAV_LEFT_B", "Navcam"], ["FHAZ_LEFT_B", "Hazcam"]];

module.exports = async (req, res) => {
  try {
    const listas = await Promise.all(CAMERAS.map(async ([id, nome]) => {
      const r = await fetch(`https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20desc&per_page=25&page=0&condition_1=msl:mission&search=${id}`);
      if (!r.ok) return [];
      const j = await r.json();
      return (j.items || []).filter(i => !i.is_thumbnail).filter((_, k) => k % 3 === 0).slice(0, id === "MAST_LEFT" ? 3 : 2)
        .map(i => ({ sol: i.sol, data: (i.date_taken || "").slice(0, 10), cam: nome, url: i.https_url }));
    }));
    const fotos = listas.flat();
    if (!fotos.length) throw new Error("sem fotos");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ fonte: "NASA/JPL-Caltech (imagens brutas do Curiosity)", fotos });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ erro: String(e.message || e) });
  }
};
