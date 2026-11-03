"""Click through a built tour (dist/<tour>/) with real clicks into the app and save one contact sheet per path.

usage: python3 tools/test_tour.py <tour> [--out DIR] [--size WxH] [--paths a,b] [--shots]
  --out    where the contact sheets go (default out/)             -> out/<tour>_<W>x<H>_<path>.png
  --size   viewport, default 1440x900 (desktop); use 400x860 for a phone
  --paths  only some paths (keys from ORDER in tour.js)
  --shots  also keep every single screenshot in out/<tour>_<W>x<H>_<path>/

Checks, per path: the intro card, every step (a click beside the highlighted control must not advance the tour,
every click step has a hint), the end card, and that a click outside the end card restarts the path. Then the
embed page (dist/_embed.html) must resize the iframe to the tour. Exits with 1 on any failure or console error.
Run tools/build.py first.
"""
import argparse
import functools
import http.server
import pathlib
import sys
import tempfile
import threading

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def sheet(shots, out, width):
    tw = 720
    th = int(shots[0][1].height * tw / shots[0][1].width)
    cols = 4 if width > 800 else 6
    rows = (len(shots) + cols - 1) // cols
    sh = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 24) + 8), "white")
    d = ImageDraw.Draw(sh)
    for i, (lbl, im) in enumerate(shots):
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 24)
        d.text((x, y), lbl, fill=(200, 0, 80))
        sh.paste(im.resize((tw, th)), (x, y + 16))
    sh.save(out)


def run(tour, out, width, height, only, keep):
    if not (DIST / tour / "index.html").exists():
        sys.exit(f"dist/{tour}/index.html not found: run python3 tools/build.py {tour}")
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(DIST)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    errs, fails, counts = [], [], {}
    out.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="tour_"))
    tag = f"{tour}_{width}x{height}"
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"{base}/{tour}/index.html", wait_until="load")
        pg.wait_for_selector("#card.on", timeout=30000)
        order = pg.evaluate("window.dotidotTour.order")
        keys = only.split(",") if only else order
        for key in keys:
            if key not in order:
                fails.append(f"no path '{key}' (ORDER is {order})")
                continue
            shots = []
            sdir = out / f"{tag}_{key}" if keep else tmp

            def snap(label):
                sdir.mkdir(parents=True, exist_ok=True)
                path = sdir / f"{len(shots):02d}.png"
                pg.screenshot(path=str(path), full_page=True)
                shots.append((label, Image.open(path).convert("RGB")))

            try:
                if pg.is_visible(f"#paths button[data-path={key}]"):
                    pg.click(f"#paths button[data-path={key}]")
                else:
                    pg.evaluate("(k) => window.dotidotTour.select(k)", key)
                pg.wait_for_function("document.querySelector('#bStart') && document.querySelector('#card.on')", timeout=30000)
                pg.wait_for_timeout(500)
                snap("intro")
                pg.click("#bStart")
                pg.wait_for_timeout(700)
                snap("start")
                first, done = True, False
                for i in range(80):
                    pg.wait_for_selector("#card.on", timeout=30000)
                    pg.wait_for_timeout(450)
                    title = pg.inner_text("#cardBody h2")
                    if pg.query_selector("#cardBody .btn.cta"):
                        snap(f"end: {title}")
                        # a click on the app outside the end card starts the same path again
                        wb = pg.query_selector("#win").bounding_box()
                        pg.mouse.click(wb["x"] + 24, wb["y"] + 24)
                        pg.wait_for_timeout(2600)
                        pg.wait_for_selector("#card.on", timeout=30000)
                        snap(f"restart: {pg.inner_text('#cardBody h2')}")
                        if pg.query_selector("#cardBody .btn.cta"):
                            fails.append(f"{key}: a click outside the end card did not restart the path")
                        done = True
                        break
                    hint = pg.inner_text("#hint") if pg.query_selector("#hint") else ""
                    snap(f"{i + 1}: {title} | {hint}")
                    click = pg.evaluate("document.getElementById('hot').classList.contains('read')") is False
                    if click:
                        if not hint.strip() or hint.strip() == "undefined":
                            fails.append(f"{key} step {i + 1} ({title}): click step without a hint (groups[g].hints[h])")
                        hb = pg.query_selector("#hot").bounding_box()
                        if first:      # a miss inside the app: nothing should advance
                            wb = pg.query_selector("#win").bounding_box()
                            mx = wb["x"] + (wb["width"] - 30 if hb["x"] < wb["x"] + wb["width"] / 2 else 30)
                            pg.mouse.click(mx, wb["y"] + wb["height"] * 0.5)
                            pg.wait_for_timeout(250)
                            if pg.inner_text("#cardBody h2") != title:
                                fails.append(f"{key}: a click beside the highlighted control advanced the tour")
                            first = False
                        pg.mouse.move(hb["x"] + hb["width"] / 2, hb["y"] + hb["height"] / 2)
                        pg.mouse.click(hb["x"] + hb["width"] / 2, hb["y"] + hb["height"] / 2)
                    else:
                        pg.click("#bNext")
                    pg.wait_for_timeout(300)
                if not done:
                    fails.append(f"{key}: did not reach the end card (stuck at '{title}')")
            except Exception as e:      # a timeout or a missing element: report it, keep the sheet so far
                fails.append(f"{key}: {type(e).__name__}: {str(e).splitlines()[0]}")
            counts[key] = len(shots)
            if shots:
                sheet(shots, out / f"{tag}_{key}.png", width)

        # the website embed: the iframe takes the height the tour reports
        pg.goto(f"{base}/_embed.html?tour={tour}", wait_until="load")
        try:
            pg.wait_for_function("document.getElementById('tour').style.height !== ''", timeout=30000)
            pg.wait_for_timeout(800)
            ih = pg.evaluate("document.getElementById('tour').getBoundingClientRect().height")
            inner = pg.frame_locator("#tour").locator(".page").bounding_box()["height"]
            if abs(ih - inner) > 2:
                fails.append(f"embed: iframe is {ih:.0f}px high, the tour inside is {inner:.0f}px")
        except Exception as e:
            fails.append(f"embed: the tour did not report its height ({type(e).__name__})")
        b.close()
    srv.shutdown()
    print(f"{tour} {width}x{height}: screenshots per path {counts}")
    print(f"contact sheets: {out}/{tag}_<path>.png")
    if errs:
        fails.append("console errors: " + " | ".join(errs[:10]))
    if fails:
        print("FAIL\n  " + "\n  ".join(fails))
        sys.exit(1)
    print("OK")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tour")
    ap.add_argument("--out", default=str(ROOT / "out"))
    ap.add_argument("--size", default="1440x900")
    ap.add_argument("--paths", default="")
    ap.add_argument("--shots", action="store_true")
    a = ap.parse_args()
    w, h = (int(v) for v in a.size.lower().split("x"))
    run(a.tour, pathlib.Path(a.out), w, h, a.paths, a.shots)
