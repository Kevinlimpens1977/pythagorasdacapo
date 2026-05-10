#!/usr/bin/env python3
"""
Generate 7.3 Slidedeck via NotebookLM - with proper polling
"""

import subprocess
import json
import time
from pathlib import Path

def run_cmd(cmd, timeout=60):
    """Run command and return result"""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", f"Timeout after {timeout}s"
    except Exception as e:
        return 1, "", str(e)

def main():
    print("=" * 70)
    print("7.3 Langste zijde berekenen - NotebookLM Slidedeck Generator")
    print("=" * 70)

    notebook_id = "d6bcaa5e-63a1-48be-b8b4-f55a8996b544"

    print(f"\n[STEP 1] Generating slidedeck...")
    print(f"  Notebook: {notebook_id}")
    print(f"  (This may take 3-10 minutes)")

    cmd = [
        "python", "-m", "notebooklm", "generate", "slide-deck",
        "Maak een Nederlands slidedeck voor VMBO 1-2. Langste zijde berekenen. Include: theorie, voorbeelden, oefenvragen.",
        "-n", notebook_id,
        "--json"
    ]

    returncode, stdout, stderr = run_cmd(cmd, timeout=600)

    if returncode != 0:
        print(f"  [ERROR] Generation failed")
        print(f"  stderr: {stderr[:200]}")
        return

    # Parse output for artifact ID
    artifact_id = None
    try:
        output = json.loads(stdout)
        artifact_id = output.get("artifact_id") or output.get("id")
    except:
        # Try regex
        import re
        match = re.search(r'"id":\s*"([^"]+)"', stdout)
        if match:
            artifact_id = match.group(1)

    if not artifact_id:
        print(f"  [WARN] No artifact ID in output")
        print(f"  stdout: {stdout[:300]}")
        return

    print(f"  [OK] Artifact ID: {artifact_id[:16]}...")

    # Step 2: Wait a bit for processing
    print(f"\n[STEP 2] Processing (waiting 15 seconds)...")
    time.sleep(15)

    # Step 3: Download PDF
    print(f"\n[STEP 3] Downloading PDF...")

    output_file = Path("boekafbeeldingen/7.3-slidedeck.pdf")
    output_file.parent.mkdir(parents=True, exist_ok=True)

    cmd_download = [
        "python", "-m", "notebooklm", "download", "slide-deck",
        artifact_id,
        "-n", notebook_id
    ]

    returncode, stdout, stderr = run_cmd(cmd_download, timeout=120)

    # Check multiple locations for the PDF
    print(f"  Checking for PDF file...")

    # Location 1: Expected location
    if output_file.exists():
        size = output_file.stat().st_size / 1024 / 1024
        print(f"  [OK] Found at: {output_file}")
        print(f"       Size: {size:.2f} MB")
        print(f"\n[SUCCESS] Slidedeck ready!")
        print(f"  PDF: {output_file.absolute()}")
        return True

    # Location 2: Current directory
    pdf_files = list(Path(".").glob("*.pdf"))
    if pdf_files:
        pdf_file = pdf_files[-1]  # Most recent
        print(f"  Found in current dir: {pdf_file}")
        if pdf_file != output_file:
            pdf_file.rename(output_file)
            size = output_file.stat().st_size / 1024 / 1024
            print(f"  Moved to: {output_file}")
            print(f"  Size: {size:.2f} MB")
            return True

    # Location 3: Downloads dir
    downloads = Path.home() / "Downloads"
    if downloads.exists():
        pdf_files = list(downloads.glob("*slide*.pdf"))
        if pdf_files:
            pdf_file = pdf_files[-1]
            print(f"  Found in Downloads: {pdf_file}")
            pdf_file.rename(output_file)
            size = output_file.stat().st_size / 1024 / 1024
            print(f"  Moved to: {output_file}")
            print(f"  Size: {size:.2f} MB")
            return True

    print(f"  [WARN] PDF not found")
    print(f"  cmd stdout: {stdout[:200]}")
    print(f"  cmd stderr: {stderr[:200]}")

    print("\n" + "=" * 70)
    print("[INFO] Generation complete, but PDF download needs manual retrieval")
    print("=" * 70)

if __name__ == "__main__":
    main()
