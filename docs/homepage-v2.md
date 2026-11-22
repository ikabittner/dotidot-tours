# Homepage tour v2: připomínky Máry (20. 11. 2026)

`tours/homepage-v2` je nová verze homepage tour podle Márovy zpětné vazby. `tours/homepage` zůstává zmrazená, v2 ji nahradí, až ji Jiří schválí.

## Rozhodnutí
- **Výjimka z pravidla 2 (jen skutečné UI), schválil Jiří:** tour smí UI marketingově zjednodušit. Skrýt nepovinné a okrajové sekce, zkrátit texty a výběr typu zdroje ukázat jako mřížku boxů. Výjimka platí jen pro v2.
- Google Merchant Center není enrichment. V Data enrichment jsou Google Ads, Google Analytics 4 a Meta.
- Revive zombies nahradil Campaign setup (založení kampaně, jen nejdůležitější kroky, zombíci zmínění v setupu). Druhá část staré cesty (vyřazení zombíků z hlavní kampaně, graduation) do v2 nepatří.

- Texty bez názvu demo e-shopu (Jiří, 22. 11. 2026): datový zdroj je „Your product feed“, doména obchodu `yourstore.com` (URL feedu https://yourstore.com/feed/products.csv). Organizace v drobečcích zůstává Demo Shop. Kvůli tomu má v2 kopii `pa_v2.html` (homepage pa.html je zmrazená).
- Dotidot MCP se v tour jmenuje „Dotidot for AI“ (Jiří, 22. 11. 2026): kopie scény `mcp_v2.html` + `mcp_v2.js`. Záložka cesty zůstává Analytics & MCP.

## Stav
- **Feed setup** (scéna `connect_v2`, kopie `connect`): výběr typu zdroje jako 4 boxy v řádku (Data feed file / CSV, XML, JSON; Google Sheets; Scraper; Google Analytics 4), formulář bez textu u Basic Auth, bez sekcí faulty row a Advanced setup a bez panelu Example URLs, odkaz „Connect Google Merchant Center →“. Enrichment: Google Ads, Google Analytics 4, Meta. Proměnná (scéna variables) beze změny.
- **Analytics & MCP** (scény pa a mcp beze změny): nové kroky na čtení. Záložky (509 / 18 losers / 42 underperformers / 9 budget spenders / 312 inactive), graf Performance over time (průměrný ROAS 597 %) a Performance insights (€3,120 a €6,840). Pak AI Insights a Opportunity. Krok s Revenue movers vypadl.
- **Campaign setup** (8 karet, 13 kliků; scény `camp_new`, `camp_setup`, `camp_ads`, postavené 22. 11. 2026): Campaigns → „+“ → Performance Max campaign → zdroj Your product feed (509 produktů) → Save & continue → přejmenování konceptu „Performance Max #14“ na PMax - Zombies → Product selection: Add product set → Zombies (312 z 509) → Save & continue → Google Merchant Center Data Feed mapping (100 % All Filled, čtení) → nová asset group s náhledem reklamy pro každý produkt → Save draft → Google Ads: Budget 50, Maximize conversions value, Target ROAS 400 % → Save. Závěr: kampaň připravená, po kontrole náhledu ji Dotidot založí v Google Ads.
  - Obrazovky podle demo účtu (docs/demo-ucet.md, část Založení PMax kampaně). Marketingové zjednodušení: krok Brand guidelines a Destination country se jen odškrtnou v menu průvodce, Google Merchant Center (v demu se nenačte) se nezobrazuje, v Campaign setup chybí karta „0 products“, v Google Ads jen Budget a Bidding, v modalu bez banneru Import a s méně typy kampaní.
  - Čísla jsou návrh (rozpočet 50, Target ROAS 400 %), v demu nejsou. Texty asset group („Deals you missed“ ap.) jsou vymyšlené ukázky, UI formuláře a náhledu je skutečné.
  - Menu průvodce (kroky s kroužky) je vlastní markup v `scenes/camp.css`, protože v design systému není. Ostatní komponenty jsou z hotových scén (hlavička, pruh ikon, pole, tlačítka, Products selection, dropdown product setů) a ze Storybooku (badge DRAFT, ikony).
  - Otevřené: nechat kroky schválit Márou; ověřit, jestli texty asset group umí proměnné z feedu (pak by šel ukázat nadpis s názvem produktu).
