# Formát tour: tour.json a tour.js

Každá tour je složka `tours/<id>/` se dvěma soubory. `tools/build.py <id>` je vloží do sdíleného rámu `shell/shell.html` a vyrobí `dist/<id>/`. Vzor: `tours/homepage/`.

## tour.json

```json
{
  "id": "zombies",
  "title": "Dotidot Product Tour: Zombies",
  "cta": { "label": "Try for free", "href": "https://dotidot.io" }
}
```

- `id` musí být stejné jako název složky (malá písmena, pomlčky). Posílá se i do zprávy o výšce pro web (docs/embed.md).
- `title` je titulek stránky (záložka prohlížeče, název iframe).
- `cta` je tlačítko na závěrečné kartě. Dokud není známá adresa registrace, `https://dotidot.io`.

## tour.js

Obyčejný JavaScript, který se vloží do skriptu rámu. Musí definovat čtyři konstanty: `PATHS`, `ORDER`, `ICONS`, `SCENES`. K dispozici jsou pomocné funkce z rámu:

| Funkce | Vrací | Použití |
|---|---|---|
| `q('#id')` | `(doc) => doc.querySelector('#id')` | prvek ve scéně |
| `root('#input')` | rodič `[data-input-root]` | celé pole formuláře (DS Input), ne jen `<input>` |
| `frameAround('#a', '#b')` | kamera kolem dvou prvků | `cam:` u kroku, kde vlastní kamera scény prvek neukazuje |

Vlastní selektor jde napsat i přímo: `el: (d) => d.querySelectorAll('#seg button')[1]`.

### SCENES

```js
const SCENES = {
  sets: { src: 'scenes/sets.html', title: 'Dotidot product set editor' },
  mcp: { src: 'scenes/mcp.html', title: 'AI assistant with Dotidot MCP', url: '' },
};
```

- Klíč je jméno, kterým se na scénu odkazují kroky (`sc`). Jen scény, které tour opravdu používá.
- `title` je přístupný název iframe (čtečky obrazovky).
- `url` je text v adresním řádku okna, výchozí `app.dotidot.io`. Prázdný řetězec adresu skryje (chat AI asistenta není Dotidot).

### ORDER a ICONS

```js
const ORDER = ['feed', 'zombies', 'ai'];
const ICONS = { feed: `<svg class="pic" ...>`, zombies: `...` };
```

- `ORDER` je pořadí cest v záložkách. První cesta je výchozí. **Jedna cesta = žádné záložky** a závěrečná karta bez odkazů na další cesty.
- `ICONS` jsou SVG ikony cest na závěrečné kartě (32 px, třída `pic`, zdroje v brand/icons). Může být `{}`.

### PATHS

```js
const PATHS = {
  zombies: {
    label: 'Revive zombies',                       // text záložky a karty „další cesta“
    intro: { title: '...', body: '...' },          // úvodní karta s tlačítkem Start the tour
    end: { title: '...', body: '...' },            // závěrečná karta s CTA
    groups: [ /* karty = dílky stepperu */ ],
    steps: [ /* zastávky na časové ose scén */ ],
  },
};
```

#### groups: karty

Jedna skupina = jedna karta a jeden dílek stepperu. Skupina může mít víc zastávek (víc kliků po sobě se stejným textem).

| Pole | Povinné | Význam |
|---|---|---|
| `title` | ano | nadpis karty (krátký, věcný, bez tečky) |
| `body` | ano | 1 až 2 věty, co se děje a proč |
| `hints` | u klikacích skupin | text nápovědy pro každý klik ve skupině, v pořadí (`h: 0, 1, 2…`), např. `'Click Add condition'` |
| `next` | ne | vlastní text tlačítka u kroku na čtení (výchozí Next, u poslední karty Finish) |
| `eye` | ano | oči Hoppyho: `?` `•` `*` `!` `+` `#` `^` `$` `\|` |

#### steps: zastávky

Kroky jdou za sebou. Mezi dvěma kroky ve stejné scéně tour přehraje časovou osu scény od `tc` k dalšímu `tc` (rychlost 0,9) a kamera se přesune.

| Pole | Povinné | Význam |
|---|---|---|
| `g` | ano | index skupiny (karty) |
| `h` | u kliku | kolikátý klik ve skupině (0, 1, 2…), vybírá text z `hints` |
| `sc` | ano | klíč scény ze `SCENES` |
| `tc` | ano | čas na ose scény (sekundy), kde tour zastaví a čeká |
| `cam` | ne | kamera: čas na kamerové ose scény (číslo), obdélník `{x, y, w}` nebo funkce `(win, doc) => obdélník` (např. `frameAround`). Výchozí = `tc` |
| `establish` | ne | `true`: nejdřív celá obrazovka appky, pak přiblížení. Dávat na první krok každé scény |
| `el` | ano | `(doc) => prvek`, který se zvýrazní. U kliku musí návštěvník kliknout právě do něj |
| `act` | ano | `'click'` (klik do appky) nebo `'read'` (tlačítko Next) |
| `near` | ne | `(doc) => větší prvek`, vedle kterého má karta stát, aby nezakryla, o čem krok je |
| `dd` | ne | otevře dropdown scény: `{ id: 'ddVar', at: (doc) => kotva, align: 'right' }`. Dropdown je prvek `.tour-dd` s tímto id ve scéně |
| `exit` | u posledního kroku scény a cesty | čas, kam se scéna dohraje při odchodu (do jiné scény nebo na závěr) |

Karta se staví vpravo od prvku, když se nevejde, tak vlevo, pod nebo nad. Na telefonu je vždy pod oknem.

### Jak najít časy (tc, cam, exit)

Časy jsou na ose scény (sekundy od začátku její animace, viz `frame(t)` a `track([...])` ve `scenes/<scéna>.js`). Scéna jde otevřít samostatně v čase t: `dist/<tour>/scenes/sets.html?nocap&t=3.45`. Postup:
1. V JS scény najít, kdy se prvek objeví a kdy na něj klikne kurzor videa (`clicks = [...]`). Tour má zastavit těsně před tím klikem.
2. Zkusit `?nocap&t=<čas>` a podívat se (screenshot), jestli je prvek vidět a v klidu.
3. Po buildu pustit test a projít kontaktní archy.

## Texty

- Anglicky, krátce, konkrétní čísla a produkty z dat scény (Canon EOS 2000D, 312 products, €679.60).
- Bez em dashes (build je odmítne), Google Merchant Center celým jménem (GMC build odmítne).
- Nadpis karty bez „Step 1“ a bez nadpisů nad nadpisem. Pořadí ukazuje stepper.
- Nápověda začíná slovesem: Click…, Pick…, Open…, Switch…, Send…
