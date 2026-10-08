"""
End-to-End Test Suite for Say It Right Application
"""
import urllib.request
import json
import time
import subprocess
import sys

def test_api():
    print("Testing Say It Right local endpoints...")

    # 1. Test Health
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/health", timeout=5)
    health = json.loads(req.read().decode())
    print("[PASS] Health Check Passed:", health)
    assert health["status"] == "healthy"

    # 2. Test Scenarios
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/scenarios", timeout=5)
    scenarios_data = json.loads(req.read().decode())
    scenarios_list = scenarios_data.get("scenarios", [])
    print(f"[PASS] Scenarios Endpoint Passed: Loaded {len(scenarios_list)} scenarios")
    assert len(scenarios_list) >= 8

    # 3. Test Analyze (Academic Extension draft)
    payload = {
        "raw_draft": "Hi Professor, I'm really sorry to bother you because I know you're super busy. I haven't been able to finish the paper. Can I maybe get some extra time please? Sorry again.",
        "context": {
            "scenario_id": "academic_extension",
            "recipient_role": "Professor / Course Instructor",
            "relationship": "Formal",
            "goal": "Emergency 48h extension"
        }
    }
    analyze_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/analyze",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    analyze_resp = urllib.request.urlopen(analyze_req, timeout=10)
    analysis = json.loads(analyze_resp.read().decode())
    print("[PASS] Analysis Endpoint Passed:")
    print("  - Engine Source:", analysis.get("source"))
    print("  - Readiness Score:", analysis.get("diagnostic", {}).get("readiness_score"))
    print("  - Anti-patterns detected:", len(analysis.get("diagnostic", {}).get("anti_patterns", [])))
    print("  - Rewrites generated:", len(analysis.get("calibrated_rewrites", [])))
    assert analysis.get("diagnostic", {}).get("readiness_score") is not None
    assert len(analysis.get("calibrated_rewrites", [])) >= 2

    # 4. Test Static Frontend Serving
    index_req = urllib.request.urlopen("http://127.0.0.1:8000/", timeout=5)
    index_html = index_req.read().decode("utf-8")
    assert "Say It Right" in index_html
    print("[PASS] Static Frontend Served Successfully")

    print("\nALL TESTS PASSED SUCCESSFULLY! The application is rock solid.")

if __name__ == "__main__":
    test_api()
