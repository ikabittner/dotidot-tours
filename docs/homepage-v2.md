# Homepage tour v2: připomínky Máry (20. 11. 2026)

`tours/homepage-v2` je nová verze homepage tour podle Márovy zpětné vazby. `tours/homepage` zůstává zmrazená, v2 ji nahradí, až ji Jiří schválí.

## Rozhodnutí
- **Výjimka z pravidla 2 (jen skutečné UI), schválil Jiří:** tour smí UI marketingově zjednodušit. Skrýt nepovinné a okrajové sekce, zkrátit texty a výběr typu zdroje ukázat jako mřížku boxů. Výjimka platí jen pro v2.
- Google Merchant Center není enrichment. V Data enrichment jsou Google Ads, Google Analytics 4 a Meta.
- Revive zombies nahradí Campaign setup (založení kampaně, jen nejdůležitější kroky, zombíci zmínění v setupu). Druhá část staré cesty (vyřazení zombíků z hlavní kampaně, graduation) do v2 nepatří.

## Stav
- **Feed setup** (scéna `connect_v2`, kopie `connect`): výběr typu zdroje jako 4 boxy v řádku (Data feed file / CSV, XML, JSON; Google Sheets; Scraper; Google Analytics 4), formulář bez textu u Basic Auth, bez sekcí faulty row a Advanced setup a bez panelu Example URLs, odkaz „Connect Google Merchant Center →“. Enrichment: Google Ads, Google Analytics 4, Meta. Proměnná (scéna variables) beze změny.
- **Analytics & MCP** (scény pa a mcp beze změny): nové kroky na čtení. Záložky (509 / 18 losers / 42 underperformers / 9 budget spenders / 312 inactive), graf Performance over time (průměrný ROAS 597 %) a Performance insights (€3,120 a €6,840). Pak AI Insights a Opportunity. Krok s Revenue movers vypadl.
- **Campaign setup:** chybí. Obrazovky založení kampaně se musí projít v demo účtu (Claude in Chrome na Jiřího počítači), kroky může vybrat Mára.
