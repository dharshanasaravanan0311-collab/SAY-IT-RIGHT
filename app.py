"""
Say It Right - High-Stakes Communication Coach
Zero-dependency, high-performance web server and API handler.
"""

import sys
import os
import json
import mimetypes
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Import internal modules
import scenarios
import coach_engine

PORT = int(os.environ.get("PORT", 8000))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

class SayItRightHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS for local testing/development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def send_json(self, status_code: int, data: dict):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # API Endpoints
        if path == "/api/health":
            has_gemini = bool(coach_engine.extract_gemini_api_key())
            return self.send_json(200, {
                "status": "healthy",
                "app": "Say It Right",
                "gemini_configured": has_gemini,
                "scenarios_available": len(scenarios.SCENARIOS)
            })

        if path == "/api/scenarios":
            return self.send_json(200, {
                "scenarios": scenarios.SCENARIOS
            })

        if path.startswith("/api/scenarios/"):
            scenario_id = path.replace("/api/scenarios/", "").strip()
            item = scenarios.get_scenario_by_id(scenario_id)
            if item:
                return self.send_json(200, item)
            else:
                return self.send_json(404, {"error": "Scenario not found"})

        # Route root or fallback to index.html
        if path == "/" or not os.path.exists(os.path.join(STATIC_DIR, path.lstrip("/"))):
            self.path = "/index.html"

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/analyze":
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length <= 0:
                return self.send_json(400, {"error": "Request body cannot be empty"})

            try:
                body_bytes = self.rfile.read(content_length)
                payload = json.loads(body_bytes.decode("utf-8"))
            except Exception as e:
                return self.send_json(400, {"error": f"Invalid JSON: {str(e)}"})

            raw_draft = payload.get("raw_draft", "").strip()
            context = payload.get("context", {})
            api_key = payload.get("api_key", None)

            if not raw_draft:
                return self.send_json(400, {"error": "raw_draft is required"})

            try:
                result = coach_engine.analyze_communication(raw_draft, context, api_key)
                return self.send_json(200, result)
            except Exception as e:
                return self.send_json(500, {"error": f"Analysis failed: {str(e)}"})

        return self.send_json(404, {"error": "Endpoint not found"})

def run_server():
    server_address = ("0.0.0.0", PORT)
    httpd = ThreadingHTTPServer(server_address, SayItRightHandler)
    print(f"================================================================")
    print(f"  Say It Right: High-Stakes Communication Coach")
    print(f"  Server running at: http://localhost:{PORT} and http://127.0.0.1:{PORT}")
    print(f"  Press Ctrl+C to stop.")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
