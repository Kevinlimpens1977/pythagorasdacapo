#!/usr/bin/env python3
"""
Test NotebookLM browser automation integration
Verifies setup and allows testing the full workflow
"""

import asyncio
import sys
from pathlib import Path

async def test_playwright_available():
    """Test if Playwright is installed"""
    print("[TEST] Checking Playwright installation...")
    try:
        from playwright.async_api import async_playwright
        print("[OK] Playwright is installed")
        return True
    except ImportError:
        print("[FAIL] Playwright not found. Install with:")
        print("  pip install playwright")
        print("  playwright install")
        return False

async def test_browser_automation_module():
    """Test if browser automation module loads"""
    print("\n[TEST] Loading browser automation module...")
    try:
        from notebooklm_browser_automation import NotebookLMBrowser
        print("[OK] Browser automation module loaded successfully")
        return True
    except ImportError as e:
        print(f"[FAIL] Could not import NotebookLMBrowser: {e}")
        return False

async def test_chromium_available():
    """Test if Chromium browser is available"""
    print("\n[TEST] Checking Chromium availability...")
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            await browser.close()
        print("[OK] Chromium is available and working")
        return True
    except Exception as e:
        print(f"[FAIL] Chromium not available: {e}")
        print("\nFix with:")
        print("  playwright install chromium")
        return False

async def test_browser_login_context():
    """Test browser context persistence"""
    print("\n[TEST] Checking browser context persistence...")
    context_dir = Path.home() / ".notebooklm" / "browser_context"
    context_file = context_dir / "state.json"

    if context_file.exists():
        print(f"[OK] Persistent login context found at {context_file}")
        return True
    else:
        print(f"[INFO] No persistent login context yet (will be created after first login)")
        print(f"  Location: {context_file}")
        return True

async def test_main_script_integration():
    """Test if main script can import browser automation"""
    print("\n[TEST] Checking main script integration...")
    try:
        # Check that the main script can be imported
        spec_text = Path("notebooklm_upload_and_generate.py").read_text()
        if "NotebookLMBrowser" in spec_text and "BROWSER_AUTOMATION_AVAILABLE" in spec_text:
            print("[OK] Main script has browser automation integration")
            return True
        else:
            print("[WARN] Main script may need browser automation integration")
            return False
    except Exception as e:
        print(f"[FAIL] Could not check main script: {e}")
        return False

async def test_full_workflow_dry_run():
    """Dry run of full workflow (no actual generation)"""
    print("\n[TEST] Browser automation module structure...")
    try:
        from notebooklm_browser_automation import NotebookLMBrowser
        browser = NotebookLMBrowser()

        # Check that all required methods exist
        required_methods = [
            "launch", "close", "ensure_logged_in", "find_or_create_notebook",
            "open_notebook", "add_source_file", "wait_for_source_processing",
            "generate_slidedeck", "download_pdf", "full_workflow"
        ]

        missing = []
        for method in required_methods:
            if not hasattr(browser, method):
                missing.append(method)

        if missing:
            print(f"[FAIL] Missing methods: {missing}")
            return False
        else:
            print("[OK] All required methods present")
            return True
    except Exception as e:
        print(f"[FAIL] Could not verify module structure: {e}")
        return False

async def main():
    print("=== NotebookLM Browser Automation Test Suite ===\n")

    tests = [
        ("Playwright Installation", test_playwright_available),
        ("Browser Automation Module", test_browser_automation_module),
        ("Chromium Browser", test_chromium_available),
        ("Browser Context Persistence", test_browser_login_context),
        ("Main Script Integration", test_main_script_integration),
        ("Module Structure", test_full_workflow_dry_run),
    ]

    results = []
    for name, test_func in tests:
        try:
            result = await test_func()
            results.append((name, result))
        except Exception as e:
            print(f"[ERROR] Test '{name}' failed with exception: {e}")
            results.append((name, False))

    # Summary
    print("\n=== Test Summary ===")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "[OK]" if result else "[FAIL]"
        print(f"{status} {name}")

    print(f"\nPassed: {passed}/{total}")

    if passed == total:
        print("\n[OK] All tests passed! System is ready for browser automation.")
        print("\nQuick start:")
        print("  python notebooklm_upload_and_generate.py --source @image.jpg --title 'Lesson'")
        return 0
    else:
        print("\n[ERROR] Some tests failed. Please fix issues above.")
        print("\nCommon fixes:")
        print("  1. pip install playwright")
        print("  2. playwright install chromium")
        print("  3. python -m notebooklm login")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
