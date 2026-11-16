# Astro Quest

Link do game: https://astro-quest-vert.vercel.app/

O histórico completo de desenvolvimento está em https://github.com/pedrodornela/nasa-space-challenge (branch daniel/equilibrio).

Protótipo para o NASA Space Apps Challenge 2026: o desafio principal é o [Junior Astronaut Mission Trainer](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/), junto com o [Abandoned but not Forgotten](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

O projeto começa num mapa 3D do Sistema Solar com os pontos onde as missões espaciais pousaram, caíram ou passaram. Nesta versão só Marte está aberto; os outros destinos aparecem com cadeado.

A missão jogável é a **MARS-01 · O Enigma de Gale**, na cratera Gale. O jogador monta uma base fictícia vista de cima (moradia, domo de plantação, torre de comunicação e rover pressurizado), cuida de quatro recursos (Energia, Suporte à vida, Alimentação e Proteção) e, pela torre, recebe da Terra as seis etapas da investigação do rover Curiosity, que é real. No computador da garagem, envia o robô explorador R-1 (fictício) aos lugares por onde o Curiosity passou; enquanto ele viaja, cuida do quadro de tarefas da base e prepara as peças da volta, e depois conserta, recarrega ou limpa o robô e compara no computador o que ele trouxe com as imagens reais do Curiosity. O jogo termina com um relatório, uma nota de 0 a 100 e a opção de repetir decisões (replay). O progresso fica salvo no navegador.

## Como rodar

É um site estático, sem etapa de build. Basta abrir com qualquer servidor estático:

```
npx serve .
```

## Textos e idiomas

Todo o texto que o jogador lê fica em `textos/`, um arquivo por idioma: português (`pt-BR.js`), inglês (`en.js`) e espanhol (`es.js`). O idioma é escolhido na tela de abertura, no rodapé do mapa ou em Menu › Configurações. Para revisar, edite esse arquivo; para traduzir, copie-o com o código do idioma no nome e abra o jogo com `?lang=en`, por exemplo. As instruções estão em `textos/LEIA-ME.md`.

## Configurações do jogo

Em Menu › Configurações: idioma, efeitos sonoros, som ambiente, leitura em voz alta (mensagens, tutorial, perguntas e avisos) e a velocidade inicial (3x por padrão). Atalhos: Espaço pausa ou continua, 1 a 3 mudam a velocidade, M abre Comunicações e C abre o Computador. Esses recursos ficam em `extras.js`.

## Créditos e licenças

- **Mapas dos planetas, da Lua e das luas:** acervo de texturas do Celestia (CelestiaContent), sob CC0, CC BY ou CC BY-SA, conforme cada arquivo.
  - Júpiter, Saturno e Netuno: Björn Jónsson e Askaniy Anpilogov (CC BY 3.0).
  - Urano: CC BY-NC-SA 3.0, só para uso não comercial.
- **Sol:** a partir de NASA/SDO (CC BY-SA 4.0).
- **Modelos 3D da Voyager e da Pioneer:** NASA 3D Resources.
- **Cena da tela de missões (`img/missao-mars01.webp`):** imagem modelo enviada pela equipe, com as anotações e a interface original removidas.
- **Cena do briefing (`img/briefing-mars01.webp`):** imagem de referência enviada pela equipe, com a interface original removida.
- **Fotos do Curiosity e de Gale (`img/gale/`):** NASA/JPL-Caltech/MSSS e NASA/JPL-Caltech/Univ. of Arizona, pela NASA Image and Video Library (PIA16064, PIA17751, PIA16156, PIA17594, PIA19161, PIA17596, PIA26403, PIA19807, PIA22209). A perfuração de Nazca e os sóis de recarga seguem o blog da missão Curiosity (NASA Science, out.–nov. 2026).
- **Livrinho do astronauta (imagens carregadas da NASA Image and Video Library):** PIA25286, PIA26045, PIA26302 (NASA/JPL-Caltech), iss068e045014 (NASA) e iss030e148403 (NASA/ESA).
- **Estudos do NASA OSDR citados no livrinho:** OSD-69 (micróbios das superfícies da Estação Espacial), OSD-766 (tomates do VEG-05 sob duas receitas de luz), OSD-611 (radiação de íons pesados e memória em camundongos) e OSD-342 (perda de músculo e osso em camundongos na Estação Espacial).
- **Minigame Laboratório:** usa os estudos OSD-342, OSD-133 (peixes medaka e osteoclastos), OSD-611, OSD-766 e OSD-678 (plantas Arabidopsis no claro e no escuro, experimento CARA). Título, organismo e missão vêm ao vivo da API de busca do OSDR, pela função `api/osdr.js`.
- **Minigame Onde montar?:** relevo colorido real da cratera Gale (MOLA, Mars Global Surveyor), em 4 imagens da NASA Mars Trek (camada `Mars_MGS_MOLA_ClrShade_merge_global_463m`, nível 6). O jogo carrega ao vivo de trek.nasa.gov e tem cópias em `img/trek/` para quando não houver internet.
- **Minigame Horta:** fatos da Agência Espacial Canadense (CSA) sobre comida no espaço: 1.900 a 3.200 calorias por dia, entregas de comida a cada poucos meses na Estação Espacial, a estufa Veggie e o projeto Naurvik em Gjoa Haven (Nunavut). As regras de cultivo da alface são simplificadas.
- **Ajuda do R-1 · Medidor de radiação:** dose real medida pelo RAD do Curiosity em Gale (5 a 17 de setembro de 2017, tempestade solar no dia 11), do NASA OSDR RadLab (instrumento `MSL-RAD-Surface`). O jogo busca ao vivo pela função `api/radlab.js` e, se não conseguir, usa os mesmos valores guardados e mostra "Dados guardados".
- **Minigame Alerta solar:** usa CMEs reais do NASA DONKI (velocidade e data), pela função `api/donki.js`.
- **Logo da equipe TerraNova Explorers:** `marca/terranova.webp`, usado na tela de abertura.
- **Biblioteca 3D:** three.js r128, carregada por CDN.

A NASA não endossa este projeto.
