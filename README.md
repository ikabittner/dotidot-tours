# Dotidot product tours

Klikací product tour pro web dotidot.io. Návštěvník si vyzkouší Dotidot přímo v maketě aplikace: kliká do skutečného UI (komponenty design systému, demo data), tour ho vede kartami a zelenými zvýrazněními. Nahrazuje obrázková Storylane dema.

Hotová je **homepage tour** (tři cesty: Feed setup, Revive zombies, Analytics & MCP). Na ní je postavený sdílený rám a knihovna obrazovek, ze kterých se skládají další tour.

## Jak začít

### 1. Přístup k repu

Repo je veřejné: stáhnout a vyzkoušet si ho může kdokoli bez přihlášení (krok 2). Ukládat změny (vlastní tour) může jen ten, koho Jiří pozve do repa jako collaboratora. S pozvánkou přihlas git na svém počítači ke GitHubu, nejjednodušeji přes GitHub CLI:

```bash
gh auth login            # jednou; GitHub CLI: https://cli.github.com
```

### 2. Stáhnout a připravit

Potřeba: Git a Python 3.11+.

```bash
git clone https://github.com/ikabittner/dotidot-tours.git
cd dotidot-tours
python3 -m venv .venv && source .venv/bin/activate     # vlastní prostředí pro Python balíčky
pip install -r requirements.txt
python3 -m playwright install chromium
```

Kontrola, že všechno běží:

```bash
python3 tools/build.py                          # postaví všechny tour do dist/
python3 tools/test_tour.py homepage             # proklikání na desktopu, kontaktní archy v out/, na konci OK
python3 -m http.server -d dist 8000             # pak v prohlížeči http://localhost:8000/homepage/
```

### 3. Spustit Claude Code v té složce

```bash
cd dotidot-tours
claude
```

Claude Code musí běžet právě ve složce `dotidot-tours` (v terminálu, nebo ji zvol jako pracovní složku v aplikaci). Jen tak si sám načte `CLAUDE.md` s pravidly a nabídne skill `/new-tour`.

Na zkoušku se ho zeptej třeba „Co je v tomhle repu a jak udělám novou tour?“. Na novou tour stačí napsat:

> Udělej tour pro ROAS strategii, nahradí Storylane demo na stránce Product Strategies.

Claude se doptá na cíl, navrhne osnovu, ověří obrazovky v demo účtu, postaví tour, otestuje ji na desktopu i telefonu a ukáže kontaktní archy. Hotovou tour ulož do repa (commit a push, Claude to udělá na požádání).

## Co si připojit
- **Claude in Chrome** (rozšíření do Chromu) a v Chromu přihlášení do demo účtu Dotidotu (organizace 2979). Jen na čtení obrazovek; v demo účtu se nic neukládá.
- **Figma** (volitelně) s přístupem do složky App Design, pro obrazovky, které v demu nejsou.
- Design system ds.dotidot.io a demo feed jsou veřejné, není potřeba nic.

## Struktura

| Kde | Co |
|---|---|
| `tours/<id>/` | obsah jedné tour: `tour.json` (název, CTA) a `tour.js` (cesty, karty, zastávky) |
| `shell/` | sdílený rám tour a maskot Hoppy |
| `scenes/` | obrazovky aplikace s časovými osami |
| `ds/`, `brand/` | CSS design systému, fonty, Hoppy, ikony |
| `tools/` | build, test, screenshot scény, zachycení komponent ze Storybooku |
| `docs/` | pravidla a znalosti: formát tour, scény, vložení na web, demo účet, design system, Figma, Storylane |

## Dokumentace

- [docs/tour-format.md](docs/tour-format.md): jak se píše tour
- [docs/scenes.md](docs/scenes.md): jak fungují a vznikají obrazovky
- [docs/embed.md](docs/embed.md): vložení na web (Astro), měření
- [docs/homepage-tour.md](docs/homepage-tour.md): rozhodnutí a historie homepage tour
- [docs/storylane-postupy.md](docs/storylane-postupy.md): Storylane dema, která nahrazujeme
- [docs/demo-ucet.md](docs/demo-ucet.md), [docs/design-system.md](docs/design-system.md), [docs/figma-mapa.md](docs/figma-mapa.md): podklady

Homepage tour je schválená a zmrazená. Její obsah, scény a CSS design systému měnit jen po domluvě s Jiřím Bittnerem.
