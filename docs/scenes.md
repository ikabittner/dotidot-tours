# Scény: jak fungují a jak udělat novou

Scéna je jedna HTML stránka 1600×900 px s jednou obrazovkou Dotidotu. Je složená ze skutečného markupu komponent design systému (`ds/assets/ds.css`) a má deterministickou časovou osu: všechno, co je vidět, je funkcí času `t`. Tour scénu načte do iframe v okně appky a posouvá jí čas: zastaví před klikem, po kliku přehraje kus osy k další zastávce.

Scény vznikly pro marketingové video, proto mají i titulky a kurzor. V tour jsou titulky vypnuté (`?nocap`) a kurzor skrytý.

## Soubory

```
scenes/engine.js          časová osa, kamera, pomocné funkce (E.*), API pro tour (setSplit, camAt)
scenes/app.css            rám aplikace (hlavička, pruh ikon, kontextové menu, obsah), stage, dropdowny .tour-dd
scenes/<scéna>.html       markup obrazovky
scenes/<scéna>.css        layout jen pro tuto obrazovku (tokeny --dds-*)
scenes/<scéna>.js         časová osa: frame(t), kamera, E.scene({...})
scenes/img/<id>.jpg       obrázky produktů z demo feedu (product_id)
```

Hotové scény:

| Scéna | Obrazovka | Délka | Používá |
|---|---|---|---|
| connect | Data sources: +, výběr typu zdroje, formulář Data feed file, import 509 produktů, Data enrichment (Google Merchant Center, Google Ads, Meta) | 9,6 s | homepage/feed |
| variables | editor textové proměnné (Variable content, výběr proměnných, Preview) | 7,6 s | homepage/feed |
| sets | nový product set (podmínky, výběr proměnné, Preview, Save) | 8,6 s | homepage/zombies |
| campaigns | PMax Products selection, přepnutí kampaně v drobečcích, Include/Exclude, Preview po aktualizaci dat | 11 s | homepage/zombies |
| pa | Product analytics, AI Insights panel, Biggest revenue movers (vlastní osa v anim.js) | 10,5 s | homepage/ai |
| mcp | chat AI asistenta s Dotidot MCP | 9,9 s | homepage/ai |

**Scény homepage tour neupravovat.** Homepage je zmrazená a jakákoli změna ve scéně se do ní propíše. Pro jiný příběh (jiná strategie, jiná čísla) udělat kopii pod novým jménem (`sets_roas.html/.css/.js`) a upravit tu.

## Kostra HTML

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Product sets</title>
<link rel="stylesheet" href="../ds/assets/ds.css"><link rel="stylesheet" href="app.css"><link rel="stylesheet" href="moje.css">
</head>
<body>
<div id="viewport"><div id="stage">
  <div class="app">
    <!-- hlavička (DS Header) -->
    <div class="frame">
      <div class="rail"><!-- pruh ikon (DS SidePanelNav collapsed) --></div>
      <div class="ctx"><!-- kontextové menu zdroje / kampaně --></div>
      <main class="content"> ... obrazovka ... </main>
    </div>
  </div>
  <!-- dropdowny pro tour: mimo tok stránky, tour je otevře a umístí -->
  <div class="dd-wrap tour-dd" id="ddVar"> ... DS Dropdown s položkami [data-dropdown-item] ... </div>
</div><div id="captions"></div></div>
<script src="engine.js"></script>
<script src="moje.js"></script>
</body></html>
```

Hlavičku, pruh ikon a kontextové menu zkopírovat z hotové scény stejné oblasti a jen přepnout aktivní položku a drobečky: `sets.html` (uvnitř datového zdroje), `campaigns.html` (uvnitř kampaně), `connect.html` (seznam Data sources), `pa.html` (Product analytics).

## Kostra JS

```js
/* Scene: <co ukazuje>. */
(function () {
  const { $, $$, prog, ease, rectOf, fitSafe, track, typeText, count } = E;
  const DUR = 6.0;
  const nameV = $('#set-name'), save = $('#save-btn');
  // obdélníky prvků pro kameru (souřadnice stage, změřené jednou)
  const R = { form: rectOf($('#form')), save: rectOf(save) };
  const cam = track([
    [0.0, fitSafe(R.form, 30)], [3.0, fitSafe(R.form, 30)],
    [3.6, fitSafe(R.save, 40), 'io'], [6.0, fitSafe(R.save, 40)],
  ]);
  function frame(t) {
    typeText(nameV, 'Zombies', t, 0.5, 14);          // text se vypisuje od t = 0.5
    save.style.transform = t >= 4.0 && t < 4.12 ? 'scale(0.96)' : '';
    $('#toast').style.opacity = prog(t, 4.2, 4.5);
  }
  E.scene({ dur: DUR, frame, camera: cam });
})();
```

Pravidla:
- **Všechno jen z `t`.** Žádné `setTimeout`, `Date.now`, náhoda ani stav, který se nastaví jednou. Tour skáče v čase dopředu i dozadu (Back, stepper), `frame(t)` musí vždy vykreslit správný stav pro dané `t`.
- **Cíle kliků mají stálé id** (`id="save-btn"`, `id="dd-zombies"`), tour.js na ně míří přes `q('#…')`.
- Kliky obsluhuje tour (zachytí je v iframe), scéna žádné handlery nepotřebuje. Hover stavy dělá CSS design systému; položky dropdownu potřebují `data-dropdown-item`, aby na ně reagoval hover.
- Fokus pole: třída `in-focus` (styl je v `sets.css`, převzít).
- Kamera: `fitSafe(obdélník, okraj)` udělá výřez 16:9 kolem prvku. `track([[t, kamera, 'io'], ...])` je kamerová osa. Tour umí i pevnou kameru (`cam` v tour.js).
- Čísla a texty musí sedět napříč scénami jedné tour (počty produktů, ceny, názvy setů a kampaní).

## Odkud brát obrazovku

1. **Aplikace, demo účet** (organizace 2979, app.dotidot.io) přes Claude in Chrome. Jen číst, formuláře nikdy neukládat. Rozložení, texty, pořadí, ikony (atribut `data-icon` v DOM). Co už je zjištěné, je v docs/demo-ucet.md.
2. **Design system** přes `tools/ds_capture.py` (níže). Skutečný markup komponent.
3. **Figma**, jen stránky [DONE], pro obrazovky, které v demu nejsou (docs/figma-mapa.md).
4. **Data**: produkty z demo feedu „Real products - demo“ (https://demoshop.dotidot.io/real-demo/products.csv, 509 produktů), obrázky do `scenes/img/<product_id>.jpg`. Čísla (kliky, ROAS, revenue) dopočítat tak, aby seděla, měna €, období 26. 9. až 25. 10. 2026. Klíčový produkt příběhů: Canon EOS 2000D + 18-55mm DC III + 75-300mm DC III (102448, €679.60).

Nic si nevymýšlet: co v aplikaci ani ve Figmě [DONE] není, do okna appky nepatří.

## Zachycení komponent: tools/ds_capture.py

```bash
python3 tools/ds_capture.py list table                         # najít story
python3 tools/ds_capture.py story ui-components-data-display-table--default-in-card --select table --png out/t.png
python3 tools/ds_capture.py story ui-components-data-display-badge--default --args '{"children":"SYNCED","intent":"positive"}'
python3 tools/ds_capture.py icons trend                        # názvy ikon
python3 tools/ds_capture.py icon general/plus --size 14        # jedna ikona jako SVG
python3 tools/ds_capture.py story patterns-header--default --prefix hd --out out/header.html
```

- `--args` změní props story (texty, intent, velikost), `--select` vezme jen část, `--png` uloží obrázek ke kontrole.
- `--prefix` přejmenuje všechna id. Nutné, když se do jedné scény skládá víc zachycených kusů (jinak kolidují id a zmizí třeba gradient ikon v AIButton).
- Na konci skript vypíše `dds:` třídy, které `ds/assets/ds.css` nestyluje. Storybook je živý a může být novější než CSS v repu. Řešení: chybějící styl dopsat do `<scéna>.css` pomocí tokenů `--dds-*`. **`ds/assets/ds.css` neměnit**: změna by se propsala do všech tour včetně homepage. Kdyby to jinak nešlo, po změně přestavět a otestovat všechny tour a porovnat screenshoty se stavem před změnou.

## Kontrola scény

```bash
python3 tools/scene_shot.py sets 0,3.45,6.95,8.6          # kontaktní pás ve zvolených časech
python3 tools/scene_shot.py sets 3.45 --full              # celá obrazovka (bez kamery)
```

Pak scénu zapojit do tour.js, `python3 tools/build.py <tour>` a `python3 tools/test_tour.py <tour>` (desktop) a `--size 400x860` (telefon) a projít kontaktní archy v `out/`.
