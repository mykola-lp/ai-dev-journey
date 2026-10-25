from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

from ant_mind.ant import Ant
from ant_mind.world import World

HOST = "127.0.0.1"
PORT = 8765

_STATE = {"ant": Ant(World.default())}


HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>ant-mind inspector</title>
  <style>
    :root { color-scheme: dark; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; background: #111; color: #eee; }
    main { max-width: 960px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 1.4rem; font-weight: 600; }
    .muted { color: #9aa; font-size: 0.9rem; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
    button { background: #2a4; color: #041; border: 0; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
    button.alt { background: #444; color: #eee; }
    button.warn { background: #a42; color: #fff; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { background: #1b1b1b; border: 1px solid #333; border-radius: 10px; padding: 14px; }
    .bar { height: 8px; background: #333; border-radius: 4px; margin: 4px 0 10px; }
    .bar > span { display: block; height: 8px; background: #6c8; border-radius: 4px; }
    .coalition { border-left: 3px solid #6c8; padding-left: 8px; margin: 8px 0; }
    pre { white-space: pre-wrap; font-size: 0.85rem; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
<main>
  <h1>Ant Mini-Consciousness Inspector</h1>
  <p class="muted">This is not a colony simulation. It shows the workspace, drives, and report: the information available for functional awareness.</p>
  <div class="row">
    <button id="tick">+1 tick</button>
    <button id="tick10" class="alt">+10 ticks</button>
    <button id="threat" class="warn">Inject threat</button>
    <button id="reset" class="alt">Reset</button>
  </div>
  <div class="grid">
    <section class="card">
      <h2>Report</h2>
      <p id="report">No ticks have run yet.</p>
    </section>
    <section class="card">
      <h2>Self-model</h2>
      <pre id="self"></pre>
    </section>
    <section class="card">
      <h2>Workspace</h2>
      <div id="workspace"></div>
    </section>
    <section class="card">
      <h2>Drives</h2>
      <div id="drives"></div>
    </section>
  </div>
</main>
<script>
async function api(path, method="GET") {
  const res = await fetch(path, {method});
  return res.json();
}
function bar(name, value) {
  const pct = Math.max(0, Math.min(100, (value || 0) * 100));
  return `<div>${name}: ${Number(value||0).toFixed(2)}<div class="bar"><span style="width:${pct}%"></span></div></div>`;
}
function render(s) {
  const last = s.last_report;
  document.getElementById("report").textContent = last ? last.text : "No ticks have run yet.";
  document.getElementById("self").textContent = JSON.stringify({
    tick: s.tick, position: s.position, self_model: s.self_model, body: s.body
  }, null, 2);
  const cs = (last && last.coalitions) || [];
  document.getElementById("workspace").innerHTML = cs.length
    ? cs.map(c => `<div class="coalition"><strong>${c.source}</strong> salience ${c.salience}<br>${c.content}</div>`).join("")
    : "<p class='muted'>empty</p>";
  const d = (last && last.drives) || {};
  document.getElementById("drives").innerHTML = Object.keys(d).map(k => bar(k, d[k])).join("") || "<p class='muted'>—</p>";
}
async function refresh() { render(await api("/api/state")); }
document.getElementById("tick").onclick = async () => render(await api("/api/tick", "POST"));
document.getElementById("tick10").onclick = async () => render(await api("/api/tick10", "POST"));
document.getElementById("threat").onclick = async () => render(await api("/api/threat", "POST"));
document.getElementById("reset").onclick = async () => render(await api("/api/reset", "POST"));
refresh();
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A002
        return

    def _json(self, payload: dict, code: int = 200) -> None:
        data = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _html(self) -> None:
        data = HTML.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/", "/index.html"):
            self._html()
            return
        if path == "/api/state":
            self._json(_STATE["ant"].snapshot())
            return
        if path == "/api/history":
            ant = _STATE["ant"]
            self._json({"history": [r.text for r in ant.history]})
            return
        self._json({"error": "not found"}, 404)

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        ant: Ant = _STATE["ant"]
        if path == "/api/tick":
            ant.tick()
            self._json(ant.snapshot())
            return
        if path == "/api/tick10":
            ant.run(10)
            self._json(ant.snapshot())
            return
        if path == "/api/threat":
            ant.world.inject_threat(ant.body.x + 1, ant.body.y, intensity=1.0)
            ant.tick()
            self._json(ant.snapshot())
            return
        if path == "/api/reset":
            _STATE["ant"] = Ant(World.default())
            self._json(_STATE["ant"].snapshot())
            return
        self._json({"error": "not found"}, 404)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"ant-mind inspector on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
