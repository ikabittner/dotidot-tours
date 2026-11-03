# Figma App Design: mapa (stav 26. 10. 2026)

Složka: Dotidot.io → App Design (folder 209883005). Přístup přes pracovní Figma účet Dotidotu.

## Jak je Figma organizovaná
- Jeden soubor = jedna oblast aplikace. Stránky jsou tikety/úkoly se stavem v názvu ([DONE], [WIP], [CANCELED], Review), k tomu Explorations, Playground a Archive.
- Index v souboru [01] Getting Started říká výslovně: Figma se nedrží 100% v souladu s produkcí, obsahuje jen části, kde do aplikace zasahoval designér. Zdroj pravdy je aplikace.
- Pravidlo pro tour: brát jen stránky [DONE] a ověřit proti aplikaci. WIP, CANCELED, Explorations, Archive a „Product Analytics v2.0 (Postponed)“ nepoužívat.

## Soubory (klíč | poslední úprava)
| Soubor | Klíč | Upraveno | Pro tour |
|---|---|---|---|
| [10] Product Analytics | H7M6d3qHjlHNAa29cCmiPZ | 2026-09-25 | ano, hlavní zdroj pro PA a AI Insights |
| [05] Campaigns | DEVP7wWAIccAJBHrhYwdDU | 2026-09-24 | ano, PMAX Campaign, Campaign Import |
| [06] Data Sources | 2fAywPECJ8mK5pJExID4DA | 2026-09-08 | částečně, Variables, chyby zdroje, výběr zdroje |
| [13] Free Tools | lf9CKVbkUqm3JMjSBQMP3n | 2026-05-29 | ne |
| [09] Actionable Analytics | SLKVxOzZ6NA2kmlGgbl7e8 | 2025-11-26 | spíš ne (jiný modul, má Connecting Accounts [Review]) |
| [07] Feed Exports | ZOOR0cdiX3Ir66B2MBtKUk | 2025-10-31 | ne |
| [04] Dashboard | PChGYYc9giQCVylKtwKHTR | 2025-10-31 | ne |
| [12] Settings | SWXGHFvsEGcoPReFlDiLVz | 2025-06-28 | ne |
| [08] Image Editor | RFwViWV9UVlX33wDSDSAEE | 2025-03-25 | ne |
| [11] CSS Program | fjY7EuLBujuFde55DJIQky | 2024-07-26 | ne |
| [03] Onboarding | LerxyfeK9IiTjHuLW3QUL6 | 2024-02-29 | ne (staré) |
| [14] Emails | mF3otW51cza9ywzoVVaeUl | 2024-02-29 | ne |
| [01] Getting Started | ltW5xZVPDkemqAHRRfDbIj | 2024-02-29 | jen index a pravidla |

„Ne“ znamená, že ve Figmě není nic aktuálního. Ty moduly se staví přímo podle aplikace.

## Product Analytics: důležité stránky
- 2456:29888 Final Design (v1.0)
- 17030:178595 New tabs navigation [DONE]
- 17596:60878 Compare [DONE]
- 17856:230413 AI Insights [DONE]: sekce 17856:230419 se stavy panelu (Default, Insight open, scrolled, History tab, empty state, no insight for date range). Hlavní rámec „Insight open“ 17856:231273 (1600×1691).
- 17884:192705 Review #2, 17931:19335 Active campaign status (nejnovější, bez stavu)
- AI Insights panel: Summary, Risk, Opportunity, Waste, What to do next, Re-generate insights, Monthly usage quota. Záložky All products, Losers, Underperformers, Budget spenders, Active products, Inactive products. Sekce Performance over time, Performance insights, Product catalog overview, Biggest revenue movers.
- Data v rámcích míchají € a Kč, pro tour je nahradíme vlastními.

## Data Sources a Campaigns
- Data Sources 10020:13574 Variables: tiket „transform numeric variable to text“, obrazovky nové proměnné 1440×1080 (karty, textInput, radioGroup, sidepanelPreview vpravo).
- Product sets ve Figmě nejsou, jen v aplikaci.
- Campaigns 8016:2 PMAX Campaign, 9169:292743 PMAX Import.

## Design tokeny aplikace (z Figma variables)
- Primary #855be2 (intense #6031a6, faint #f6f4fe, subtle #e0dafa, muted #c9bdf5). Pozor: aplikace používá jinou fialovou než marketingový brand (Grape #5A0078). V okně appky aplikační fialová, rám tour je Grape.
- Písmo: display Poppins SemiBold (10–32 px), body Inter (10–16 px), line-height 1.2, odstavce 1.4.
- Text default #333e47, muted #516778, subtle #859bab. Plochy: background #ffffff, surface #f9fafb, ghost #eceff2. Obrysy #f4f4f5 / #e4e4e7 / #d4d4d8.
- Stavy: attention #ff264a, warning #f59e0b, positive #63bc26, informative #3b82f6. Highlight pinky #f06893, violet #a17cec.
- Zaoblení 4 / 6 / 8 / full. Mezery 2–48. Stín xs 0 1 2 rgba(0,0,0,.05).
