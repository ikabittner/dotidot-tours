# Demo účet Dotidot (organizace 2979): co je v aplikaci (stav 26. 10. 2026)

Procházeno jen čtením, nic se neměnilo. Pravidlo: v demo účtu nic nepřepisovat. Formuláře jen otevřít, nikdy neukládat.

## Vzhled aplikace
- Aplikace už běží na design systému (třídy dds:, SidePanelNav). Nový vzhled je tedy živý, není potřeba čekat na migraci. Část vnořených stránek (např. Data enrichment, kontextové menu zdroje) má ještě starší ikony bez data-icon.
- Stránky nejvyšší úrovně (Dashboard, Campaigns, Data sources) mají boční menu s popisky. Uvnitř datového zdroje, kampaně a v Product analytics je úzký pruh ikon + kontextový panel.
- Navigace a ikony: Dashboard (general/menu-dashboard), Campaigns (general/campaign), Data sources (general/data-sources), Image editor (general/image-type), Feed exports (general/feed-export), Product analytics (general/all-analytics) | Keywords (general/key), Ads (general/adtext), Sitelinks (general/sitelink) | Organization settings (general/organization-cog).
- Hlavička: logo, přepínač organizace, vpravo pole „Search all“, nastavení, notifikace, avatar. Na detailu zdroje / kampaně drobečková navigace Organizace / Data sources (Campaigns) / název.

## Product analytics
- Hlavička stránky: titulek „Product analytics“, výběr data „Sep 26 – Oct 25, 2026 (30d)“, přepínač „Compare“. Tlačítka „Download as CSV“ a „AI Insights“ z Figmy tu nejsou.
- Vpravo dole plovoucí tlačítko „AI Assistant“: chat „Ask about your product data“. V demu hlásí „Failed to load chat sessions“.
- Karty Performance insights mají ikony general/alert-filled (červená), general/fill-error (oranžová), general/active (zelená), odkaz general/arrow-right.
- Reporty v demu nemají data (spend 0 za posledních 15 dní). Pro tour data generujeme.

## Data sources
- Seznam: tlačítko „Create a new data source“ otevře modal „Create a new data source“: vlevo filtry All data sources / With data feed / Without data feed / Demo data / Enrichment, vpravo vyhledávání a dlaždice s oranžovými ikonami: I already have data feed (Data feed file „Upload any of your feed in a supported format (CSV, XML, JSON).“, Google Sheets), I don't have data feed yet (Scraper, Google Analytics 4 NEW), Try data from Demoshop (Category feed, Product feed), Enrich an existing data source (Google Ads „Enhance your feed with product statistics from Google Ads“, Google Analytics 4, Scraper, Scraper Lite, Google Sheet, Meta „Enrich your feed with Meta Insights product statistics.“, Heureka).
- Formulář Data feed file: hlavička „← XML, JSON or CSV feed“, Name (+ Labels), „URL address of your data source file“, odkaz „Want to connect Google Merchant Center instead?“, přepínač Basic Auth, „How to handle faulty row in the data source“, Advanced setup, Custom email notifications, dole „Add data source“. Vpravo panel „Example URLs“.
- Nejlepší zdroj: „Real products - demo“ (id 21305, 509 produktů, https://demoshop.dotidot.io/real-demo/products.csv).
- Detail zdroje: hlavička s „←“, názvem a štítkem UPDATED, vpravo „509 products“, „New grouped data source“, „Update data source“ (primary), menu. Kontextové menu: Setup, Update schedule | DATA: Products, Variables, Image editor, Rules for export (BETA), Product sets (TRY NOW), Data enrichments (TRY NOW), Master fields | USED IN: Additional data sources, Campaigns, Feed exports | ACTIVITY: Sync history, Activity log, Incidents.
- Edit text variable („Name - clear“): Name + Labels; Variable content s „Input text“ (fialové čipy „⚡ _name_ ×“, fialové tlačítko proměnných), přepínač „Generate, even if an input variable is missing a value“; Find and replace (řádky Regular expression / Text, hodnota, „Replace with…“, „Add find & replace“); Remove text; Text rule (přepínače); Change case; dole „Save custom variable“ a „Custom variable will be applied to 509 products“. Vpravo „Preview“ s Refresh a hledáním, u každého produktu id, původní text (odstraněné části červeně) a výsledek.
- Product sets: seznam se sloupci Conditions, Products currently, Unique identifier. Edit product set: „Edit product set“, „Product set name“, Conditions v bloku „Where“ (ikona general/branch), řádky podmínek s malým kroužkem pokrytí, výběr proměnné + lupa + podmínka („less than“) + hodnota + koš, pod řádkem „26 out of 509 items selected.“, přepínač AND/OR, „Add condition“ or „Add product set“, „Add condition group“, souhrn „25 products selected“ s kroužkem, Preview tabulka, Save / Cancel.

## Campaigns
- Seznam s grafem Clicks a dlaždicemi metrik nahoře, tabulka se stavy SYNCED TODAY / DRAFT / ARCHIVED. Data v CZK a s nereálným ROAS, pro tour nepoužitelná.
- Detail PMax kampaně: hlavička „←“, název, štítek SYNCED, vpravo odkaz na datový zdroj, „501 products“, přepínač Google Ads, „Synchronize again“. Kontextové menu: Dashboard, Insights (NEW), Campaign details, Product selection, Google Merchant, Data Mapping, Asset Groups | AD SYSTEMS: Google Ads | OPTIONAL: Google Ads assets | Preview | ACTIVITY: Sync history, Activity log, Incidents.
- Products selection: „Filter products“, blok „Where“, segment Include / Exclude, čip product setu se složkou a odznakem počtu filtrů, „501 out of 509 items selected.“, Add condition / Add product set, Add condition group, „501 products selected“, Preview tabulka, dole Save a „Use 501/509 products“.
- Dashboard kampaně: graf Clicks s dlaždicemi metrik (Clicks, Impressions, Price, CTR, ROAS, Conversion value, Conversions), karta Product analytics, Performance Max Insights.
