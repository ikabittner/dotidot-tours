"""Build interactive tours into dist/<tour>/.

usage: python3 tools/build.py [tour ...]        (no argument = every folder in tours/)

Per tour:
  dist/<tour>/index.html      standalone page: local preview and the website iframe (see docs/embed.md)
  dist/<tour>/artifact.html   the same page without the document wrapper, for a claude.ai artifact
  dist/<tour>/scenes/         the scene library (real Dotidot UI) the tour steps through
  dist/<tour>/ds/assets/      design system CSS (latin fonts inlined) and its assets
  dist/<tour>/brand/, hoppy.js   Hoppy
Also dist/_embed.html: a plain white page that embeds a tour the way the website will (?tour=<id>).

A tour is tours/<tour>/tour.json (id, title, cta) + tours/<tour>/tour.js (PATHS, ORDER, ICONS, SCENES).
"""
import base64
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TOURS, DIST = ROOT / "tours", ROOT / "dist"
FONTS = {"__EYES_FONT__": ROOT / "brand" / "eyes_google_sans_code.woff2"}
A = ROOT / "ds" / "assets"
for key, fn in [("__POPPINS_500__", "poppins-latin-500-normal-C8OXljZJ.woff2"), ("__POPPINS_600__", "poppins-latin-600-normal-zEkxB9Mr.woff2"),
                ("__INTER_400__", "inter-latin-400-normal-C38fXH4l.woff2"), ("__INTER_500__", "inter-latin-500-normal-Cerq10X2.woff2"),
                ("__INTER_600__", "inter-latin-600-normal-LgqL8muc.woff2")]:
    FONTS[key] = A / fn
WRAP = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
        '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>'
        '</head><body>{page}</body></html>')
EMBED_DEMO = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Embed check</title>
<style>body{margin:0;font:16px/1.5 system-ui;color:#1a1b1f;background:#fff} main{max-width:1320px;margin:0 auto;padding:48px 16px}
iframe{display:block;width:100%;border:0;height:900px}</style></head><body><main>
<p>Website section above the tour.</p>
<iframe id="tour" data-dotidot-tour title="Dotidot product tour" loading="lazy"></iframe>
<p>Website section below the tour.</p>
</main><script>
const id = new URLSearchParams(location.search).get('tour') || 'homepage';
document.getElementById('tour').src = id + '/?embed';
// the same listener goes on the website (docs/embed.md)
window.addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'dotidot-tour:height') return;
  document.querySelectorAll('iframe[data-dotidot-tour]').forEach((f) => { if (f.contentWindow === e.source) f.style.height = e.data.height + 'px'; });
});
</script></body></html>
"""


def b64(path, mime="font/woff2"):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def check(tour, meta, js):
    """Cheap checks on the content; the click-through test checks the structure in the browser."""
    errs = []
    for k in ("id", "title", "cta"):
        if k not in meta:
            errs.append(f"tour.json: missing '{k}'")
    if meta.get("id") != tour:
        errs.append(f"tour.json: id '{meta.get('id')}' should match the folder name '{tour}'")
    for name in ("PATHS", "ORDER", "ICONS", "SCENES"):
        if not re.search(rf"\bconst {name}\b", js):
            errs.append(f"tour.js: missing 'const {name}'")
    if "—" in js or "—" in json.dumps(meta, ensure_ascii=False):
        errs.append("texts contain an em dash (—); rewrite the sentence")
    if re.search(r"\bGMC\b", js):
        errs.append("write Google Merchant Center in full, not GMC")
    for src in re.findall(r"src:\s*'([^']+)'", js):
        if not (ROOT / src).exists():
            errs.append(f"tour.js: scene {src} does not exist")
    return errs


def build(tour):
    tdir = TOURS / tour
    meta = json.loads((tdir / "tour.json").read_text())
    js = (tdir / "tour.js").read_text()
    errs = check(tour, meta, js)
    if errs:
        sys.exit(f"{tour}: " + "\n  ".join(["cannot build"] + errs))
    out = DIST / tour
    if out.exists():
        shutil.rmtree(out)
    (out / "ds" / "assets").mkdir(parents=True)
    (out / "brand").mkdir()
    shutil.copytree(ROOT / "scenes", out / "scenes")
    css = (A / "ds.css").read_text()
    for m in set(re.findall(r"url\(\./([^)]*latin[^)]*\.woff2)\)", css)):
        fp = A / m
        if fp.exists():
            css = css.replace(f"url(./{m})", f"url({b64(fp)})")
    (out / "ds" / "assets" / "ds.css").write_text(css)
    shutil.copy(A / "empty-box@2x.png", out / "ds" / "assets")
    for f in ["av_body.webp", "av_voice.webp"]:
        shutil.copy(ROOT / "brand" / f, out / "brand" / f)
    shutil.copy(ROOT / "shell" / "hoppy.js", out / "hoppy.js")

    page = (ROOT / "shell" / "shell.html").read_text()
    body = "\n".join(("  " + l) if l.strip() else l for l in js.rstrip("\n").split("\n"))
    page = page.replace("/*__TOUR__*/", body).replace("/*__META__*/", json.dumps(meta, ensure_ascii=False))
    page = page.replace("__TITLE__", meta["title"])
    for key, fp in FONTS.items():
        page = page.replace(key, b64(fp))
    (out / "artifact.html").write_text(page)
    (out / "index.html").write_text(WRAP.replace("{page}", page))
    files = [p for p in out.rglob("*") if p.is_file()]
    print(f"{tour}: dist/{tour}/  {len(files)} files, {sum(p.stat().st_size for p in files) // 1024} KB")


def main(args):
    tours = args or sorted(p.name for p in TOURS.iterdir() if (p / "tour.json").exists())
    DIST.mkdir(exist_ok=True)
    for t in tours:
        if not (TOURS / t / "tour.json").exists():
            sys.exit(f"no tour '{t}' (expected tours/{t}/tour.json)")
        build(t)
    (DIST / "_embed.html").write_text(EMBED_DEMO)


if __name__ == "__main__":
    main(sys.argv[1:])
