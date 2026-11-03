# Storylane dema na webu: co nahrazujeme a postupy v UI (stav 26. 10. 2026)

Zdroj: veřejná Storylane dema na dotidot.io (Product Strategies) a v Learnu (support.dotidot.io). Dema jsou obrázková (PNG screenshoty 2560 px), ne HTML capture. Postupy níže popisují, co se v nich v aplikaci dělá; při stavbě tour je ověřit v demo účtu (UI se mezitím mohlo změnit).

## Seznam dem

| Téma | Storylane ID | Kde je | Poznámka k datům | Scény v repu |
|---|---|---|---|---|
| Nahrání data source | 6j7thpuqjdbv | Learn | čisté demo data (demoshop.dotidot.io/electronics, 5 284 produktů) | connect |
| Performance Max setup | zdxjmuzjk1wg | Learn | starší UI | campaigns (jen Product selection), zbytek nový |
| Product Analytics | m880po2ho1uw | Learn | čistá demo data (hračkářství, €), listopad 2025, bez AI Insights | pa |
| Zombies (Google Ads) | fktpkdnwsva5 | Product Strategies | webinar feed s 0 produkty, banner „Synchronization suspended“ | sets, campaigns (homepage cesta Revive zombies) |
| ROAS | kmnisyouvop1 | Product Strategies | dtto | connect, variables, sets, campaigns |
| Profit margin | mw5kvlxump4x | Product Strategies | dtto | variables, sets, campaigns |
| New products | wfwx26m7pp1y | Product Strategies | dtto | sets, campaigns |
| Underperformers | hgbvnoudik5q | Product Strategies | dtto | sets, campaigns |
| CTR | udbrcdmaaboy | Product Strategies | | sets, campaigns |
| CPA | hlvheo5myuv6 | Product Strategies | | sets, campaigns |
| Bestsellers | zqgxrsxoadwo | Product Strategies | | sets, campaigns |
| POAS | žádné demo | | | |

Sloupec „Scény v repu“ je odhad, ze kterých stávajících scén se tour dá složit. Scény mají data a časové osy pro zombie příběh, takže pro jinou strategii je potřeba upravit hodnoty (podmínky, počty, produkty) nebo udělat kopii scény, viz docs/scenes.md.

## Připojení dat
1. Levé menu „Data sources“ → „+“.
2. Filtr typů zdrojů, k dispozici jsou i demo zdroje pro testování. Nejčastější typ: XML/CSV/JSON feed.
3. Formulář: „Name“, „URL address of your data source file“, volitelně „Data feed is protected by Basic Auth“, „Use custom importer“, chování vadných řádků → „Add data source“. Ve formuláři je odkaz „Want to connect Google Merchant Center instead?“.
4. Import běží, rovnou jde tvořit kampaň. Hotový zdroj má stav „UPDATED“ a v hlavičce počet produktů.
5. Tabulka „Products“: detail produktu, náhled proměnné, poměr in stock / out of stock, filtry, „Data explorer“.
6. Menu data source: Setup, Update schedule, Products, Variables, Image editor, Rules (BETA), Product sets, Data enrichment, Campaigns, Feed exports, Sync history.
- Google Ads a Meta data: „Data enrichment“ → „Google Ads products stats“ (metriky Clicks, Price, Impressions, All conversions, Conversion value, ROAS…, časová okna Yesterday až Last 365 days, Custom).
- Google Merchant Center v PMax kampani: „Select Data feed from GMC“ nebo „Link new GMC account“ (texty v UI).
- Účet Google Ads, rozpočet a bidding: poslední krok kampaně „Advertising system“.

## Variables
1. Data source → „Variables“ → „+“ → typ proměnné (Text, Numeric, Conditional, Array, Remapping, Countdown, Hiding).
2. „Name“, „Variable content“ s „Input text“ (proměnné jako čipy + výraz), formátování čísel.
3. Vpravo „Preview“: pro každý produkt vstup a výstup.
4. Příklad z ROAS dema: ads_last_60d_roas × 100 = ROAS %.

## Product sets (segmentace)
1. Data source → „Product sets“ → „+“.
2. „Product set name“, „Conditions“ v blocích „Where“ spojených AND/OR: proměnná + podmínka + hodnota, „Add condition“, „Add product set“.
3. Živě „X out of Y items selected“, dole „Save“ a „Use N/M products“.
4. Seznam setů se sloupci Conditions, Products currently, Unique identifier.
5. Podmínky Highest/Lowest s přepínačem % / Count (např. top 10 % podle ga4_last_60d_revenue).
- first_seen_on: Dotidot ho generuje sám, když produkt poprvé uvidí ve feedu.

## Zombies (Google Ads)
1. Data enrichment → Google Ads products stats → Metrics „Clicks“, Time range „Last 60 days“.
2. Product set: ads_last_60d_clicks „equals to“ 0 AND first_seen_on „older or equal than“ 7 days ago (vyřadí nové produkty).
3. Campaigns → „+“ → typ (Performance Max, Shopping, Search) → stejný data source → „Add product set“ → Zombie set → „Include“.
4. V hlavních kampaních stejný set „Exclude“.
- Důsledek: set je dynamický. Jakmile produkt dostane klik, ze setu vypadne a protože je z hlavních kampaní vyloučený jen přes tento set, vrátí se do nich sám.
- Web uvádí okno 30 dní, demo 60 dní. Web zmiňuje i „graduation“ při 20+ konverzích jako alternativní definici.

## ROAS strategie
1. Enrichment ROAS za 60 dní, volitelně proměnná ROAS %.
2. Product sety podle úrovní ROAS (např. ≥ 400 %).
3. Kampaně: High ROAS (tROAS ≥ 500 %, největší rozpočet), Medium (301–499 %), Low (300 %). Doporučené formáty Standard Shopping a Performance Max.
- Underperformers: ROAS 100–199 % a spend > 99. Losers: ROAS < 100 % a spend > 100.
- Bestsellers: top 10 % podle GA4 revenue za 60 dní, po kategoriích.
- New products: first_seen_on „newer or equal“ 14 dní, vlastní kampaň, z hlavních Exclude.

## Kampaň (PMax)
Campaigns → „+“ → import existující PMax nebo nová → data source → země → název → Google Merchant Center (feed, label, země, jazyk) → product selection (filtry, Include/Exclude product setů) → data mapping (povinná pole, zelená = OK, oranžová = chybí) → asset groups (Final URL, Path1/2, až 20 obrázků, 5 log, 5 YouTube videí, 5 short a 5 long headlines, 4 long descriptions, Company name, CTA, Audience signal, Themes) → Advertising system (účet, rozpočet, bidding, targeting).

## Product Analytics (demo z listopadu 2025)
1. „Product Analytics“ → „+ Create Report“ → název, data source, data enrichment (Meta nebo Google Ads), posledních 30 dní.
2. „Performance insights“: Key alerts (červené), Potential concerns (oranžové), Notable observations (zelené). Příklad: „Non-promoted products: 60 % of products had fewer than 10 clicks in the last 30 days“.
3. „Product analytics“ záložky: All products, Losers, Underperformers, Budget spenders, Active products. Prahy jdou upravit a vše se přepočítá.
4. Tabulka: Spend, ROAS, Conversions, Conv. value, Clicks, Impressions.
5. „Where your budget goes“: skupiny 10 % / 50 % / 80 % spendu, grafy Products by budget groups a Revenue by budget groups.
- Chybí: AI Insights, Revenue movers, nový denní/týdenní dashboard (jsou na webu, ne v demu).

## Co v Storylane demech chybí
AI Insights, Revenue movers, MCP, aktuální UI Product Analytics. Segmenty Heroes/Sidekicks/Villains/Zombies jsou rámec z webu; v UI jde o běžné product sety s vlastními názvy.
