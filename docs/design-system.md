# Dotidot Design System (ds.dotidot.io)

- Storybook s React knihovnou @ppcbee/design-system, pre-1.0 alpha. Popisuje se jako source of truth pro tokeny a komponenty, postavená přímo z Figma design systému.
- Aplikace (ppcbee_control) už na design systému běží, viz demo-ucet.md. Sekce Migration v Storybooku popisuje přechod z legacy SCSS.
- Styl: jeden zkompilovaný styles.css (Tailwind v4 bez runtime, třídy s prefixem `dds:`), tokeny jako CSS proměnné --dds-* (v CSS celkem 579 včetně palet). Ikony Tabler přes komponentu Icon, v sadě 554 ikon. Stav komponent v data-* atributech. Fonty Inter a Poppins jsou součástí buildu.
- V repu je CSS zmrazené v `ds/assets/ds.css` (verze, se kterou vznikla homepage tour). Neměnit bez kontroly všech tour, viz docs/scenes.md.
- Tokeny sedí s Figma variables: primary #855be2, text #333e47 / #516778, Poppins (display), Inter (body), radius md 6 px.
- Balíček je v privátním GitHub Packages (@ppcbee scope), zdrojový repozitář není v Storybooku uvedený. Pro tour stačí veřejný Storybook.

## Komponenty, které se v tour hodí
- Patterns: AppShell, Header (včetně subheaderu), SidePanelNav (collapsed rail odpovídá navigaci aplikace), ViewTabs (přesně záložky Product Analytics), Card, ActionBar, FilterPanel, Drawer, StatusPanel.
- Data Display: Table, Badge, Chip, Tag, PromoBadge (BETA), VariableBadge, VariableTag, MiniChart, ProgressBar (příklad „Monthly usage quota 7/10 used“ z AI Insights), EmptyState, Tooltip.
- Data Entry: VariableInput, Select, Combobox, Tile, Switch, NumberInput, DateRangePicker, Field.
- AI: AIButton (včetně aktivního stavu „AI Insights“), AIAura, AIThinking, AILoader.
- Charts: BarChart, LineChart, AreaChart, DonutChart, ChartCard, ChartLegend, ScoreCard, Sparkline.

## Pořadí zdrojů pro scény
1. Aplikace (demo účet): co existuje, postupy, layout, texty, ikony (data-icon v DOM).
2. Design system: stavební materiál (skutečný markup a CSS komponent, tokeny). Zachytává se `tools/ds_capture.py`.
3. Figma, jen stránky [DONE]: obrazovky, které v demu ještě nejsou (např. AI Insights), a reference layoutu. Názvy ikon jsou v názvech instancí (get_metadata do hloubky instance). Viz figma-mapa.md.

## Ikony: ověřené mapování (z aplikace a Figmy)
- Karty Performance insights: červená general/alert-filled, oranžová general/fill-error (plný trojúhelník), zelená general/active (plný zelený checkmark), vše 20 px. Trend general/increase-trend-arrow 20 px, odkaz general/arrow-right 18 px.
- AI Insights panel: titulek = gradientní sparks stejné jako v AIButton (24 px), BETA = PromoBadge s general/beta, zavřít = IconButton s general/close-x-symbol. Záložky Insight = general/search-chart, History = general/history (20 px).
- AI karty (ikona 14 px v 24px rámečku): Summary reporting/chartbar-widget, Risk general/decrease-trend-arrow, Opportunity i Waste general/increase-trend-arrow, What to do next general/flag. Tlačítka v kartách mají general/arrow-increase 14 px.
- Panel reportů: plus general/plus 14 px (ghost), menu reportu general/more, Product stats systems/adwords-icon 32 px, Share feedback general/campaign 18 px.
- Navigace: general/menu-dashboard, campaign, data-sources, image-type, feed-export, all-analytics | key, adtext, sitelink | organization-cog.
- Pozor: SVG ikon sbírané z dokumentačních stránek Storybooku (viewMode=docs) mají navíc barevné třídy dokumentace (dds:text-text-default). Při použití nechat jen „dds:inline-block dds:shrink-0 dds:align-middle“, jinak ikona nepřebírá barvu. `tools/ds_capture.py icon <název>` dává čistou ikonu.

## Postup stavby scén (ověřeno na pilotu 26. 10. 2026)
- Storybook stories se renderují v headless Chromiu (Playwright), uloží se jejich markup a ten se složí do stránky se stylesheetem DS (`tools/ds_capture.py`). Layout a bloky, které v DS nejsou, se stylují tokeny --dds-*.
- Pozor na duplicitní id: gradient ikon v AIButton odkazuje na id, při skládání víc komponent je potřeba id přejmenovat (`--prefix`), jinak ikona zmizí.
- Data scén z jednoho zdroje (reálné produkty z demo feedu, generovaná čísla, €, 26. 9. až 25. 10. 2026), aby všechna čísla na obrazovce seděla.
- Poznámka k prostředí: v cloudovém prostředí Claude byly dostupné jen ds.dotidot.io a demoshop.dotidot.io, aplikace se proto procházela přes Claude in Chrome a Figma přes Figma napojení. V lokálním Claude Code to omezení není, ale aplikace se stejně prochází v přihlášeném Chromu.

## Pilot: Product Analytics + AI Insights
- Postaven podle Figma rámce 17856:231273 (AI Insights, Insight open), hlavička a navigace podle živé aplikace. Snímek 1920×1080 = stránka 1600×900 při měřítku 1,2.
- Odchylky od Figmy: bez „Download as CSV“ (v aplikaci není, místo něj přepínač Compare), bez banneru „Want better results?“.
