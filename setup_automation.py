#!/usr/bin/env python3
"""
Setup script for NotebookLM automation dependencies
Ensures all required packages are installed for full workflow
"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd: list, description: str) -> bool:
    """Run command and report result"""
    print(f"\n[INFO] {description}...")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[OK] {description}")
            return True
        else:
            print(f"[ERROR] {description} failed:")
            print(result.stderr[:500])
            return False
    except Exception as e:
        print(f"[ERROR] {description} error: {e}")
        return False

def main():
    print("=== NotebookLM Automation Setup ===\n")

    # 1. Core dependencies
    print("Step 1: Installing core dependencies...")
    core_packages = [
        "notebooklm-py[browser]",
        "playwright",
        "pillow",
        "aiohttp",
    ]

    for package in core_packages:
        if not run_command([sys.executable, "-m", "pip", "install", package], f"Install {package}"):
            print(f"[WARN] Failed to install {package}, continuing...")

    # 2. Playwright browser installation
    print("\nStep 2: Installing Chromium browser for Playwright...")
    if not run_command([sys.executable, "-m", "playwright", "install", "chromium"],
                       "Install Chromium browser"):
        print("[WARN] Chromium installation may have issues, but continuing...")

    # 3. Verify notebooklm CLI
    print("\nStep 3: Verifying NotebookLM CLI...")
    if run_command([sys.executable, "-m", "notebooklm", "--help"], "Check NotebookLM CLI"):
        print("[OK] NotebookLM CLI available")
    else:
        print("[WARN] NotebookLM CLI not fully available")

    # 4. Summary
    print("\n=== Setup Complete ===")
    print("\nYou can now run:")
    print("  python notebooklm_upload_and_generate.py --source @image.jpg --title 'Lesson Title'")
    print("\nThe script will:")
    print("  1. Try API-based generation (notebooklm CLI)")
    print("  2. Fall back to browser automation if API fails")
    print("  3. Open Chromium and automate NotebookLM GUI")
    print("\nFor more info, check CLAUDE.md")

if __name__ == "__main__":
    main()
