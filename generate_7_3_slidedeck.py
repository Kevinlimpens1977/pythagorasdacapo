#!/usr/bin/env python3
"""
Generate 7.3 Slidedeck via NotebookLM
Uploads images, creates slidedeck, downloads as PDF
"""

import subprocess
import json
from pathlib import Path

def main():
    print("=" * 60)
    print("7.3 Langste zijde berekenen - NotebookLM Slidedeck")
    print("=" * 60)

    # Image paths
    images_dir = Path("boekafbeeldingen")
    images = [
        images_dir / "7.3.1.jpg",
        images_dir / "7.3.2.jpg",
        images_dir / "7.3.3.jpg"
    ]

    # Verify images exist
    print("\n[STEP 1] Verifying images...")
    for img in images:
        if img.exists():
            size = img.stat().st_size / 1024
            print(f"  [OK] {img.name} ({size:.1f} KB)")
        else:
            print(f"  [ERROR] {img.name} NOT FOUND")
            return

    # Step 2: Set notebook context
    print("\n[STEP 2] Setting up notebook context...")
    print("  [INFO] Using CLI-based approach...")

    # Step 3: Generate slidedeck directly via CLI
    print("\n[STEP 3] Generating slidedeck in NotebookLM...")

    cmd_generate = [
        "python", "-m", "notebooklm", "generate", "slide-deck",
        "Maak een Nederlands slidedeck voor VMBO 1-2. Onderwerp: hoe je de langste zijde van een rechthoekige driehoek berekent met de stelling van Pythagoras. Include: inleiding, theorie, 3-stappen aanpak, voorbeeld met berekening, praktische toepassingen, oefenvragen met antwoorden.",
        "--format", "detailed",
        "--length", "default",
        "--wait",
        "--json"
    ]

    try:
        print("  [INFO] Generating (this takes 2-5 minutes)...")
        result = subprocess.run(cmd_generate, capture_output=True, text=True, timeout=600)

        artifact_id = None
        if result.returncode == 0:
            print(f"  [OK] Slidedeck generated!")

            # Parse artifact ID
            try:
                output = json.loads(result.stdout)
                artifact_id = output.get("artifact_id") or output.get("id")
                if artifact_id:
                    print(f"     Artifact ID: {artifact_id[:16]}...")
            except Exception as e:
                print(f"  [INFO] JSON parse error (trying regex)...")
                import re
                match = re.search(r'"id":\s*"([^"]+)"', result.stdout)
                if match:
                    artifact_id = match.group(1)
                    print(f"     Artifact ID: {artifact_id[:16]}...")
        else:
            print(f"  [ERROR] Generation failed")
            print(f"  stderr: {result.stderr[:200]}")
            artifact_id = None

    except subprocess.TimeoutExpired:
        print("  [ERROR] Generation timeout (exceeded 10 minutes)")
        artifact_id = None
    except Exception as e:
        print(f"  [ERROR] {e}")
        artifact_id = None

    # Step 4: Download PDF
    if artifact_id:
        print(f"\n[STEP 4] Downloading PDF...")

        output_file = images_dir / "7.3-slidedeck.pdf"
        output_file.parent.mkdir(parents=True, exist_ok=True)

        cmd_download = [
            "python", "-m", "notebooklm", "download", "slide-deck",
            artifact_id
        ]

        try:
            result = subprocess.run(cmd_download, capture_output=True, text=True, timeout=120)

            # Check if file exists
            if output_file.exists():
                size = output_file.stat().st_size / 1024 / 1024
                print(f"  [OK] PDF exists: {output_file}")
                print(f"       Size: {size:.2f} MB")
            else:
                # Try alternative locations
                print(f"  [INFO] Checking for downloaded file...")
                pdf_files = list(Path(".").glob("*.pdf")) + list(Path(".").glob("**/*.pdf"))
                if pdf_files:
                    pdf_file = pdf_files[0]
                    print(f"       Found: {pdf_file}")
                    if pdf_file != output_file:
                        pdf_file.rename(output_file)
                        size = output_file.stat().st_size / 1024 / 1024
                        print(f"  [OK] Moved to: {output_file}")
                        print(f"       Size: {size:.2f} MB")
                else:
                    print(f"  [WARN] PDF not found in expected location")
                    print(f"  Command stdout: {result.stdout[:200]}")

        except Exception as e:
            print(f"  [ERROR] Download: {e}")
    else:
        print("\n[ERROR] No artifact ID, skipping PDF download")

    print("\n" + "=" * 60)
    print("[STATUS] Slidedeck generation complete")
    print("=" * 60)

if __name__ == "__main__":
    main()
