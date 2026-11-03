# Dotidot product tours

Klikací product tour Dotidotu pro web dotidot.io (náhrada Storylane dem). Návštěvník kliká přímo do makety aplikace postavené ze skutečných komponent design systému a demo dat. Každá tour je statická složka, která se vloží na web (Astro) přes iframe.

Komunikace s uživatelem česky. Texty v tour anglicky. Dokumentace v `docs/` česky.

## Pravidla (neporušovat)

1. **Demo účet jen číst.** app.dotidot.io, organizace 2979, přes Claude in Chrome. Formuláře jen otevřít, nikdy neukládat; neklikat na Save, Delete, Connect, Synchronize ani nic, co mění data.
2. **V okně appky jen skutečné UI.** Co není v aplikaci ani ve Figmě na stránce [DONE], si nevymýšlet. Chybí podklad → zeptat se uživatele (screenshot, jiný účet).
3. **Homepage tour je zmrazená.** `tours/homepage/`, scény, které používá (connect, variables, sets, campaigns, pa, mcp), a `ds/assets/ds.css` neměnit bez výslovného pokynu Jiřího Bittnera. Pro jiný příběh scénu zkopírovat pod novým jménem.
4. **Změna sdíleného rámu** (`shell/shell.html`, `shell/hoppy.js`, `scenes/engine.js`, `scenes/app.css`) se propíše do všech tour. Po ní přestavět a otestovat všechny tour (desktop i telefon) a projít kontaktní archy homepage.
5. **Vzhled podle homepage:** zelený rámeček zvýraznění (žádné červené, appka se neztmavuje), akce klikem do UI, Next jen u kroků na čtení a hned vedle Back, bez nadpisů nad titulky karet, Hoppy na levém dolním rohu okna. Podrobně docs/homepage-tour.md.
6. **Texty:** bez em dashes, Google Merchant Center celým jménem, konkrétní čísla a produkty ze scény.
7. Hotovo je až po buildu, testu na desktopu i telefonu (`OK`) a prohlédnutí kontaktních archů.

## Struktura

```
tours/<id>/tour.json, tour.js   obsah tour: cesty, karty, zastávky (docs/tour-format.md)
shell/shell.html                rám tour: fialový blok, okno appky, karta, zvýraznění, stepper, Hoppy
shell/hoppy.js                  maskot Hoppy
scenes/                         knihovna obrazovek appky s časovými osami (docs/scenes.md)
ds/assets/ds.css                CSS design systému, zmrazené
brand/                          Hoppy, font očí, ikony cest
tools/build.py                  tours/<id> -> dist/<id>/ (index.html pro web, artifact.html pro claude.ai)
tools/test_tour.py              proklikání skutečnými kliky, kontaktní archy do out/, kontrola vložení
tools/scene_shot.py             screenshot scény v čase t (hledání zastávek)
tools/ds_capture.py             markup komponent a ikony ze Storybooku ds.dotidot.io
docs/                           znalosti: demo účet, design system, Figma, Storylane dema, homepage, vložení
```

`dist/` a `out/` jsou generované (v .gitignore).

## Příkazy

```bash
pip install -r requirements.txt && python3 -m playwright install chromium   # jednou
python3 tools/build.py                       # všechny tour (nebo: python3 tools/build.py homepage)
python3 tools/test_tour.py homepage          # desktop 1440x900
python3 tools/test_tour.py homepage --size 400x860   # telefon
python3 -m http.server -d dist 8000          # náhled: http://localhost:8000/homepage/ a /_embed.html?tour=homepage
```

## Nová tour

Postup je ve skillu `.claude/skills/new-tour/SKILL.md` (spouští se i jako `/new-tour`). Zkráceně: ujasnit příběh a cíl s uživatelem → zjistit, co nahrazuje (docs/storylane-postupy.md) → ověřit obrazovky v demo účtu → znovu použít scény, nebo udělat kopie a nové (docs/scenes.md) → `tours/<id>/` (docs/tour-format.md) → build, test, kontaktní archy → ukázat uživateli → vložení na web (docs/embed.md).

## Kde co zjistit

- Co je v aplikaci a jak vypadá: docs/demo-ucet.md, pak živě v demo účtu.
- Komponenty a ikony: docs/design-system.md, `tools/ds_capture.py`.
- Obrazovky, které v demu nejsou: docs/figma-mapa.md (jen [DONE], přes Figma napojení).
- Co dělají Storylane dema, která nahrazujeme: docs/storylane-postupy.md.
- Proč homepage vypadá a chová se, jak se chová: docs/homepage-tour.md.
