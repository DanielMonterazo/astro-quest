# Textos do jogo

Todo o texto que o jogador lê está nesta pasta, um arquivo por idioma:

- `pt-BR.js`: português do Brasil, o idioma original e a reserva para os outros.
- `en.js`: inglês.
- `es.js`: espanhol.

O jogador escolhe o idioma no canto da tela de abertura, no rodapé do mapa ou em Menu › Configurações. A escolha fica guardada no navegador.

## Revisar ou corrigir um texto

1. Abra `pt-BR.js` e procure a frase (Ctrl+F).
2. Mude só o texto entre aspas, à direita dos dois-pontos. Não mude o nome à esquerda (a "chave").
3. Salve e recarregue o jogo.

Algumas regras:

- `{0}`, `{1}`… são valores que o jogo coloca na frase (um número, um nome). Eles podem mudar de lugar na frase, mas precisam continuar lá.
- `<b>…</b>`, `<br>`, `<span>` etc. são formatação. Mantenha as marcas abertas e fechadas.
- Aspas dentro do texto precisam de barra antes: `\"`.

### Como o arquivo é organizado

| Parte | O que tem |
|---|---|
| `html` | Título da aba, botão e texto dos créditos |
| `missoes` | Nome, ano e história de cada missão marcada no mapa |
| `mapa` | Planetas, luas, sondas, lacunas de imagem e notas dos pontos das missões |
| `ui` | Botões, dicas e mensagens do mapa e da tela de abertura, agrupados pela parte do código que os usa |

## Adicionar outro idioma

1. Copie `pt-BR.js` com o código do idioma no nome, por exemplo `en.js` ou `es.js`.
2. Na primeira linha de código, troque `TEXTOS["pt-BR"]` por `TEXTOS["en"]` (o mesmo código do nome do arquivo).
3. Traduza os textos. O que faltar aparece em português.
4. Inclua o idioma na lista `IDIOMAS` do arquivo `extras.js` (código e nome) para ele aparecer no seletor, e na tabela `TROCA_ABRIGO` do `index.html` (troca de "nave" por "moradia" nos avisos). Também dá para abrir o jogo com `?lang=en` no fim do endereço. O jogo guarda a escolha no navegador; `?lang=pt-BR` volta ao português.


## Para quem mexe no código

No código do jogo, cada texto aparece como `TXT("chave")`. A chave é o caminho dentro deste arquivo (por exemplo, `ui.abertura.iniciar`). Se uma chave não existir no idioma escolhido, o jogo usa a de `pt-BR.js`.
