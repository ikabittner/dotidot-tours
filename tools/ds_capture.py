"""Capture real component markup from the Dotidot design system Storybook (https://ds.dotidot.io) for scenes.

usage:
  python3 tools/ds_capture.py list [text]                     stories whose id or title contains text
  python3 tools/ds_capture.py story <story-id> [options]      rendered markup of one story
  python3 tools/ds_capture.py icon <name> [--size 20]         one icon as inline SVG (e.g. general/plus)
  python3 tools/ds_capture.py icons [text]                    icon names

story options:
  --args JSON        change the story's args first, e.g. '{"children": "Add condition", "intent": "primary"}'
  --select CSS       keep only this element inside the story (default: everything the story renders)
  --all              with --select: every match, not just the first
  --prefix P         rename every id (and its references) to P-<id>, so several captures can share one scene
  --out FILE         write the markup to FILE (default: print it)
  --png FILE         also save a screenshot of the rendered story to look at
  --width N          viewport width (default 1600)

After every capture the script lists dds: classes that ds/assets/ds.css does not style. The live Storybook can be
newer than the CSS the tours ship with; see docs/scenes.md before touching ds.css.
Only reads ds.dotidot.io. Needs: pip install playwright && playwright install chromium.
"""
import argparse
import json
import pathlib
import re
import sys
from html import unescape

from playwright.sync_api import sync_playwright

SB = "https://ds.dotidot.io"
ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / "ds" / "assets" / "ds.css"


def index(pg):
    r = pg.request.get(f"{SB}/index.json", timeout=30000)      # through the browser: plain urllib gets a 403
    return {k: v for k, v in r.json()["entries"].items() if v.get("type") == "story"}


def render(pg, sid, args=None):
    pg.goto(f"{SB}/iframe.html?id={sid}&viewMode=story", wait_until="networkidle")
    pg.wait_for_selector("#storybook-root > *", timeout=30000)
    if args:
        pg.evaluate("([sid, a]) => window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', {storyId: sid, updatedArgs: a})", [sid, args])
    pg.wait_for_timeout(700)


def grab(pg, select=None, every=False):
    return pg.evaluate("""([sel, every]) => {
        const root = document.querySelector('#storybook-root');
        if (!sel) return root.innerHTML;
        const els = every ? [...root.querySelectorAll(sel)] : [root.querySelector(sel)].filter(Boolean);
        if (!els.length) throw new Error('nothing matches ' + sel);
        return els.map((e) => e.outerHTML).join('\\n');
    }""", [select, every])


def prefix_ids(html, p):
    ids = set(re.findall(r'\bid="([^"]+)"', html))
    for i in sorted(ids, key=len, reverse=True):
        n = f"{p}-{i}"
        html = re.sub(rf'\bid="{re.escape(i)}"', f'id="{n}"', html)
        html = html.replace(f"url(#{i})", f"url(#{n})").replace(f'href="#{i}"', f'href="#{n}"')
        html = re.sub(rf'\b(for|aria-labelledby|aria-describedby|aria-controls|aria-owns)="([^"]*)"',
                      lambda m: m.group(1) + '="' + " ".join(n if t == i else t for t in m.group(2).split()) + '"', html)
    return html


def unstyled(pg, html):
    """dds: classes in the markup that ds.css has no selector for (exact CSS escaping done by the browser)."""
    css = CSS.read_text()
    classes = sorted({c for cl in re.findall(r'\bclass="([^"]*)"', html) for c in unescape(cl).split() if c.startswith("dds:")})
    escaped = pg.evaluate("(cs) => cs.map((c) => CSS.escape(c))", classes)
    return [c for c, e in zip(classes, escaped) if "." + e not in css]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["list", "story", "icon", "icons"])
    ap.add_argument("what", nargs="?", default="")
    ap.add_argument("--args", default="")
    ap.add_argument("--select", default="")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--prefix", default="")
    ap.add_argument("--out", default="")
    ap.add_argument("--png", default="")
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--size", type=int, default=20)
    a = ap.parse_args()

    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": a.width, "height": 900})
        if a.cmd == "list":
            t = a.what.lower()
            for k, v in index(pg).items():
                if t in k or t in v["title"].lower():
                    print(f"{k}\t{v['title']} / {v['name']}")
            return
        if a.cmd == "icons":
            render(pg, "ui-components-general-icon--default")
            names = pg.evaluate("""async () => {
                const s = await window.__STORYBOOK_PREVIEW__.storyStoreValue.loadStory({storyId: 'ui-components-general-icon--default'});
                const t = s.argTypes.name || {};
                return t.options || (t.control && t.control.options) || (t.type && t.type.value) || [];
            }""")
            if not names:
                sys.exit("the Icon story does not list its options; look at Foundations/Icons in Storybook")
            for n in names:
                if a.what.lower() in n.lower():
                    print(n)
            return
        if a.cmd == "icon":
            if not a.what:
                sys.exit("icon name missing, e.g. general/plus (list them: python3 tools/ds_capture.py icons plus)")
            render(pg, "ui-components-general-icon--default", {"name": a.what, "size": a.size})
            html = grab(pg, "svg")
            if f'data-icon="{a.what}"' not in html:
                sys.exit(f"no icon '{a.what}' (list them: python3 tools/ds_capture.py icons {a.what.split('/')[-1]})")
        else:
            if not a.what:
                sys.exit("story id missing (find one: python3 tools/ds_capture.py list table)")
            render(pg, a.what, json.loads(a.args) if a.args else None)
            html = grab(pg, a.select or None, a.all)
        if a.prefix:
            html = prefix_ids(html, a.prefix)
        if a.png:
            pg.locator("#storybook-root").screenshot(path=a.png)
        missing = unstyled(pg, html)
        b.close()
    if a.out:
        pathlib.Path(a.out).write_text(html + "\n")
        print(f"{a.out}: {len(html)} chars", file=sys.stderr)
    else:
        print(html)
    if missing:
        print(f"warning: {len(missing)} dds: classes are not in ds/assets/ds.css: {' '.join(missing[:20])}"
              + (" ..." if len(missing) > 20 else ""), file=sys.stderr)


if __name__ == "__main__":
    main()
