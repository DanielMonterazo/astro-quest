/* Dados reais da NASA guardados dentro do jogo. São usados quando não há internet
   ou quando as funções ao vivo (/api/donki e /api/fotos) não respondem.
   Os textos para as crianças ficam em textos/pt-BR.js (seção "nasa"). */
window.DADOS_NASA = {
  // eventos de clima espacial que chegaram a Marte e foram medidos pelo Curiosity (RAD) e pela MAVEN
  eventos: [
    { id: "2024-05", tipo: "CME", data: "2024-05-20",
      url: "https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/" },
    { id: "2017-09", tipo: "FLR", data: "2017-09-10", classe: "X8.2",
      url: "https://science.nasa.gov/mission/maven/" }
  ],
  // RAD (Radiation Assessment Detector) do Curiosity, em Gale
  rad: { mSvDia: 0.7, url: "https://science.nasa.gov/mission/msl-curiosity/" },
  // distância média de Marte ao Sol, para calcular quanto tempo uma CME leva para chegar
  kmAteMarte: 228e6,
  // fotos brutas do Curiosity (sol 5070, 10/11/2026) para quando a busca ao vivo falhar
  fotos: [
    { sol: 5070, data: "2026-11-10", cam: "Mastcam", url: "https://mars.nasa.gov/msl-raw-images/msss/05070/mcam/5070ML1102540061307053C00_DXXX.jpg" },
    { sol: 5070, data: "2026-11-10", cam: "Mastcam", url: "https://mars.nasa.gov/msl-raw-images/msss/05070/mcam/5070ML1102530111307049C00_DXXX.jpg" },
    { sol: 5070, data: "2026-11-10", cam: "Mastcam", url: "https://mars.nasa.gov/msl-raw-images/msss/05070/mcam/5070ML1102530071307045C00_DXXX.jpg" },
    { sol: 5070, data: "2026-11-10", cam: "Navcam", url: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/05070/opgs/edr/ncam/NLB_847595410EDR_F1252274CCAM03070M_.JPG" },
    { sol: 5070, data: "2026-11-10", cam: "Navcam", url: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/05070/opgs/edr/ncam/NLB_847595242EDR_F1252274NCAM00354M_.JPG" },
    { sol: 5070, data: "2026-11-10", cam: "Hazcam", url: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/05070/opgs/edr/fcam/FLB_847593585EDR_F1252274FHAZ00302M_.JPG" }
  ],
  trek: "https://trek.nasa.gov/mars/"
};
