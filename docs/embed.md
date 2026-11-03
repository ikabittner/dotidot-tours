# Vložení tour na web (místo Storylane)

Build (`python3 tools/build.py <id>`) dává statickou složku `dist/<id>/`. Nepotřebuje server ani knihovny, jen soubory.

## Astro web

1. Zkopírovat `dist/<id>/` do repa webu jako `public/tours/<id>/`. Astro složku `public/` servíruje beze změn, tour pak běží na `https://dotidot.io/tours/<id>/`.
2. Na stránku dát iframe s parametrem `?embed` (bez bílého okraje kolem fialového bloku, mezery dělá sekce webu):

```astro
---
// src/components/ProductTour.astro
const { id, title = 'Dotidot product tour' } = Astro.props;
---
<iframe src={`/tours/${id}/?embed`} title={title} data-dotidot-tour loading="lazy"
  style="display:block;width:100%;border:0;height:900px"></iframe>

<script is:inline>
  // tour posílá svou výšku (mění se s šířkou a na telefonu s kartou pod oknem)
  if (!window.__dotidotTourListener) {
    window.__dotidotTourListener = true;
    window.addEventListener('message', (e) => {
      if (!e.data || e.data.type !== 'dotidot-tour:height') return;
      document.querySelectorAll('iframe[data-dotidot-tour]').forEach((f) => {
        if (f.contentWindow === e.source) f.style.height = e.data.height + 'px';
      });
    });
  }
</script>
```

Použití: `<ProductTour id="homepage" />`. Tam, kde je dnes vložené Storylane demo (iframe nebo skript Storylane), ho nahradit touto komponentou.

3. Lokální kontrola bez webu: `dist/_embed.html?tour=<id>` je bílá stránka s textem nad a pod a s iframe přesně podle snippetu výše. `tools/test_tour.py` ji kontroluje automaticky (iframe musí mít výšku tour).

Poznámky:
- Výška 900 px v atributu style je jen do první zprávy z tour.
- Tour stahuje scény až při výběru cesty, celkem jednotky MB (fonty jsou vložené v CSS). `loading="lazy"` odloží načtení, dokud není iframe blízko obrazovky.
- Šířka bloku je max. 1320 px, uvnitř se okno appky škáluje. Pod 760 px se karta přesune pod okno.
- Na stránce může být víc tour najednou, listener je jeden.

## Měření (zatím není v kódu)

Plán z homepage tour, udělá Jiří (GA4 a HubSpot jsou na webu, GA4 přes Google Tag Manager):
- Události: `tour_view`, `tour_start`, `tour_step` (step_number, step_name), `tour_miss_click`, `tour_complete`, `tour_cta_click` (cta_location), `tour_replay`, všechny s `tour_path` a nově i `tour_id` (id z tour.json).
- Tour běží v iframe, takže `dataLayer` webu nevidí. Rám (`shell/shell.html`) má události posílat rodiči přes `postMessage({ type: 'dotidot-tour:event', ... })` a listener na webu (vedle toho na výšku) je přepošle do `window.dataLayer.push(...)`.
- V GTM jeden trigger Custom Event s regexem `^tour_` a jeden GA4 Event tag s parametry (Data Layer Variables). V GA4 zaregistrovat vlastní dimenze ještě před spuštěním (nejsou zpětné), klíčové události `tour_complete` a `tour_cta_click`, funnel exploration od `tour_start` po `tour_cta_click`.
- Try for free s parametrem `?ref=product_tour`, cross-domain s app.dotidot.io, pokud má aplikace vlastní GA4. Ověřit v Tag Assistant / DebugView.

## Náhled jako claude.ai artifact (volitelné)

Pro sdílení náhledu odkazem z Claude: stránka `dist/<id>/artifact.html` (bez obalu dokumentu) a ostatní soubory z `dist/<id>/` jako `files` s root `dist/<id>/`. Homepage tour je takhle publikovaná v artifactu, který vlastní Jiří; do cizího artifactu publikovat nejde, vlastní náhled si každý udělá zvlášť.
