# Homepage tour: rozhodnutí a historie (stav 3. 11. 2026)

Tour `tours/homepage` je první klikací product tour Dotidotu a vzor pro další. Je zmrazená ve verzi, se kterou byl Jiří spokojený (2. 11. 2026, claude.ai artifact verze 7, 9 a 10 mají stejný obsah). **Neměnit bez Jiřího pokynu.** Rozhodnutí níže platí i pro nové tour, pokud se pro ně výslovně nerozhodne jinak.

## Proč vlastní tour a ne Storylane
- Tour se staví z HTML makety appky ze skutečných komponent design systému a demo dat, ne ve Storylane. Důvod: v demo účtu se nesmí nic měnit, takže příběhy jako zombie (product set, kampaně, graduation) by ve Storylane nešlo nahrát. Storylane dema na webu jsou navíc jen obrázková a se starým UI (docs/storylane-postupy.md).
- Web běží na Astru z GitHubu (žádné Webflow), tour se do něj vkládá jako statická stránka v iframe (docs/embed.md).

## Vzhled a chování
- Náhled ukazuje přesně to, co se vloží na web: bílá stránka a na ní fialový blok (Grape #5A0078) s tour. V bloku jsou jen záložky cest, okno appky a stepper. Bez loga, bez nápisu Product tour, bez horního Try for free.
- Bez malých nadpisů nad titulky karet (Interactive tour, Step 1 of 9, Tour complete) a bez řádku „9 steps · about 2 minutes · demo data“. Pořadí kroku ukazuje jen stepper.
- Úvodní záběr: po Start je nejdřív vidět celá obrazovka appky (postranní menu, hlavička), po chvilce se kamera přiblíží na první prvek (`establish: true` v kroku).
- Akční kroky se dělají klikem přímo do UI appky, ne tlačítkem Next. Next zůstává jen u kroků na čtení.
- Zvýraznění je jen zelený rámeček (#32D583, barva „Try for free“) s jemným pulzem, kroky na čtení mají rámeček bez pulzu. Ne červené (evokovalo chybu). Appka se neztmavuje.
- Nápověda akce („Click …“, značka zaoblený čtvereček) je v řádku hned vedle Back, tam kde u kroků na čtení je Next. U kroků s více kliky ukazují tečky, kolikátá akce to je.
- Karta s textem je u zvýrazněného prvku, na mobilu se přesune pod okno.
- Hoppy (maskot) sedí na levém dolním rohu okna appky, oči se mění po krocích a kouká na zvýrazněný prvek.
- Appka působí živě: prvky mají normální hover stavy z design systému, kliknout jde ale jen na zvýrazněný prvek. Klik jinam nic neudělá, zvýraznění se zhoupne a nápověda na kartě zatřese.
- Závěrečná karta: větší Try for free v červené #FF264A (předpoklad: webová CTA barva, ověřit proti webu) a karty zbylých cest s ikonami (brand/icons). Tlačítko Replay není: klik mimo závěrečnou kartu do ztlumené appky spustí stejnou cestu znovu.
- V okně appky jen skutečné UI. Seznamy v podmínkách a výběry proměnných jsou DS Dropdown, které tour otevírá ve scéně.
- Texty anglicky, bez em dashes, Google Merchant Center celým jménem.

## Cesty
- **Feed setup** (9 kroků, 14 kliků; scény connect a variables): + v Data sources, Data feed file, Name, URL, Add data source; 509 produktů (čtení); Connect u Google Merchant Center, Google Ads a Meta; nová proměnná: Name, tlačítko proměnných, product_type, tlačítko proměnných, name; náhled titulků s Canonem (čtení); Save custom variable.
- **Revive zombies** (9 kroků, 14 kliků; scény sets a campaigns): product set Zombies, Include v PMax - Zombies, přepnutí na PMax - ROAS, Exclude, Run the next update, graduation Canonu.
- **Analytics & MCP** (6 kroků; scény pa a mcp): klik na AI Insights; karta Opportunity (čtení); Revenue movers s Canonem 742 % ROAS (čtení); v chatu AI asistenta klik do pole a odeslání otázky; odpověď z dat (čtení); Confirm u návrhu zvýšit rozpočet PMax - Zombies z €40 na €60 denně.
- Chat AI asistenta je scéna mcp.html (Your AI assistant, Dotidot MCP connected), okno pro ni nemá adresu app.dotidot.io.

## Technika
- Scény (scenes/) jsou původně scény marketingového videa: deterministické časové osy (engine.js), které tour zastavuje před každým klikem. Tour má vlastní kopii, změny ve videu (GSAP, NumberFlow od v6) se do ní nepropisují.
- Rám tour je shell/shell.html, obsah cest tours/homepage/tour.js. Build tools/build.py, test proklikání tools/test_tour.py.
- Před rozdělením na shell a tour.js (3. 11. 2026) byla homepage ověřena proti původní verzi: stejné soubory scén, CSS a obrázků, screenshoty všech kroků na desktopu i telefonu se liší jen vyhlazením textu a očima Hoppyho.

## Otevřené
- Měření přes GA4 a Google Tag Manager (plán v docs/embed.md, udělá Jiří).
- Skutečná adresa registrace pro Try for free (teď https://dotidot.io) a přesná barva webového CTA (teď #FF264A).
- Ověřit v appce výběr proměnné a že Dotidot MCP umí měnit rozpočet kampaně (akce v kroku Confirm).
- Vložení na homepage (Astro web na GitHubu).
- Na telefonu je tour malá. Podle podílu mobilních návštěv homepage (GA4) zvážit, jestli na mobilu místo ní nedat video.
- Případně hlasový doprovod po kapitolách (ElevenLabs) a psaní textu návštěvníkem místo automatického vypsání.
