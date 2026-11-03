---
name: new-tour
description: Vytvoření nové klikací product tour Dotidotu (třeba náhrada Storylane dema na webu) od příběhu přes scény a tour.js po build, test a vložení na web. Použít, když uživatel chce novou tour nebo novou cestu v tour.
---

# Nová product tour

Než začneš, přečti CLAUDE.md (pravidla) a docs/tour-format.md. Pro nové obrazovky i docs/scenes.md.

## 1. Ujasnit zadání (zeptat se, co chybí)

- Co má návštěvník po tour pochopit nebo udělat (jedna věta).
- Kam tour půjde (stránka webu) a jestli nahrazuje Storylane demo (které, viz docs/storylane-postupy.md).
- Jedna cesta, nebo víc cest se záložkami.
- Cílová délka: homepage cesty mají 6 až 9 karet a 2 až 3 minuty.

Navrhni osnovu: karty (nadpis + jedna věta) a u každé, co návštěvník udělá (klik na co, nebo čtení). Nech si ji schválit, než začneš stavět.

## 2. Ověřit obrazovky

- Projdi postup v demo účtu (app.dotidot.io, organizace 2979) přes Claude in Chrome. **Jen číst, nic neukládat.** Zapiš texty, pořadí, ikony (`data-icon`), stavy.
- Co v demu není: Figma jen [DONE] (docs/figma-mapa.md). Ani tam → zeptej se uživatele, nevymýšlej.
- Rozhodni pro každou kartu scénu: hotová scéna beze změny (jen když sedí i data a čísla), kopie hotové scény s jinými daty, nebo nová scéna.

## 3. Scény

- Hotové scény homepage neměň. Kopie: `cp scenes/sets.html scenes/sets_roas.html` (a .css, .js), uprav odkazy na css/js uvnitř a data.
- Nová scéna podle docs/scenes.md: rám appky z hotové scény stejné oblasti, komponenty přes `tools/ds_capture.py`, data z demo feedu, časová osa jen z `t`, stálá id na cílech kliků.
- Kontroluj průběžně: `python3 tools/scene_shot.py <scéna> 0,1,2,3,4 --full` a prohlédni obrázek.

## 4. tour.json a tour.js

- `tours/<id>/tour.json` (id = název složky) a `tours/<id>/tour.js` podle docs/tour-format.md, vzor `tours/homepage/tour.js`.
- Zastávky (`tc`) hledej v JS scény (časy kliků kurzoru) a ověř `scene_shot.py`. Na první krok každé scény `establish: true`, na poslední krok scény a cesty `exit`.
- Texty anglicky, krátce, bez em dashes, Google Merchant Center celým jménem.

## 5. Build a test

```bash
python3 tools/build.py <id>
python3 tools/test_tour.py <id>                  # desktop
python3 tools/test_tour.py <id> --size 400x860   # telefon
```

- Oba testy musí skončit `OK`. Pak si **prohlédni kontaktní archy** v `out/` (Read): zvýraznění sedí na prvku, karta nic důležitého nezakrývá, kamera ukazuje, o čem krok je, na telefonu je karta pod oknem.
- Když jsi měnil cokoli sdíleného (shell, engine.js, app.css), otestuj i `homepage` na obou velikostech.

## 6. Ukázat uživateli

- Lokálně: `python3 -m http.server -d dist 8000` → `http://localhost:8000/<id>/` a vložení `http://localhost:8000/_embed.html?tour=<id>`.
- Pošli kontaktní archy a shrň karty. Změny dělej až po jeho připomínkách a po každé změně znovu build a test.

## 7. Na web

Podle docs/embed.md: `dist/<id>/` do `public/tours/<id>/` v repu webu a komponenta s iframe místo Storylane. Do repa webu sahej jen na pokyn uživatele (vlastní větev a PR).

## 8. Zapsat

Do `docs/` (nový soubor `docs/<id>-tour.md`) zapiš rozhodnutí, co tour ukazuje, ze kterých scén je a co zůstalo otevřené, ať na to další člověk naváže.
