"""Screenshot one scene at given times, to find the stops (tc, cam, exit) for tour.js or to check a new scene.

usage: python3 tools/scene_shot.py <scene> <t[,t,...]> [--out out/scene_<scene>.png] [--cam x,y,w] [--full]
  <scene>   file name in scenes/ without .html (sets, campaigns, connect, variables, pa, mcp, ...)
  <t>       one time or a comma list (seconds on the scene timeline); several times make a contact strip
  --cam     a fixed camera rect instead of the scene's own camera track
  --full    the whole app screen (camera 0,0,1600)
Runs straight from the repo (no build needed). Prints the console errors of the scene, if any.
"""
import argparse
import functools
import http.server
import pathlib
import threading

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("scene")
    ap.add_argument("times")
    ap.add_argument("--out", default="")
    ap.add_argument("--cam", default="")
    ap.add_argument("--full", action="store_true")
    a = ap.parse_args()
    if not (ROOT / "scenes" / f"{a.scene}.html").exists():
        raise SystemExit(f"no scenes/{a.scene}.html")
    times = [float(t) for t in a.times.split(",")]
    cam = "0,0,1600" if a.full else a.cam
    out = pathlib.Path(a.out or ROOT / "out" / f"scene_{a.scene}.png")
    out.parent.mkdir(parents=True, exist_ok=True)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    errs, shots = [], []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        for t in times:
            url = f"http://127.0.0.1:{srv.server_address[1]}/scenes/{a.scene}.html?nocap&t={t}" + (f"&cam={cam}" if cam else "")
            pg.goto(url, wait_until="load")
            pg.add_style_tag(content="#cursor{display:none!important}")      # the tour hides the video cursor too
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            path = out.with_name(f"{out.stem}_{t}.png") if len(times) > 1 else out
            pg.screenshot(path=str(path))
            shots.append((t, path))
        dur = pg.evaluate("window.DUR || null")
        b.close()
    srv.shutdown()
    if len(times) > 1:
        tw, th, cols = 640, 360, 3
        rows = (len(shots) + cols - 1) // cols
        sh = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 24) + 8), "white")
        d = ImageDraw.Draw(sh)
        for i, (t, path) in enumerate(shots):
            x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 24)
            d.text((x, y), f"t = {t}", fill=(200, 0, 80))
            sh.paste(Image.open(path).convert("RGB").resize((tw, th)), (x, y + 16))
            path.unlink()
        sh.save(out)
    print(f"{out}  (scene length {dur} s)")
    if errs:
        print("console errors:", " | ".join(errs[:10]))


if __name__ == "__main__":
    main()
