#!/usr/bin/env python3
"""
NotebookLM Authentication Setup
Handles Google login and stores credentials for later use
"""

import asyncio
from pathlib import Path
from notebooklm.auth import AuthTokens
from notebooklm.client import NotebookLMClient
import sys

async def setup_authentication():
    """Set up NotebookLM authentication via browser"""

    try:
        print("[AUTH] NotebookLM Authentication Setup")
        print("=" * 50)
        print("\n[INFO] A browser window will open for Google login...")
        print("Complete the login, then return here.\n")

        # Create auth tokens from browser (Playwright)
        auth_tokens = await AuthTokens.from_browser()
        print("[OK] Authentication successful!")

        # Save for later use
        storage_path = Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
        print(f"[OK] Credentials saved to: {storage_path}\n")

        # Test connection
        print("[TEST] Testing connection to NotebookLM...")
        async with NotebookLMClient(auth_tokens) as client:
            notebooks = await client.notebooks.list()
            print(f"[OK] Connected! Found {len(notebooks)} notebook(s)\n")

            if notebooks:
                print("[LIST] Your Notebooks:")
                for nb in notebooks:
                    print(f"  - {nb.title} (ID: {nb.id})")

        return True

    except Exception as e:
        print(f"[ERROR] Authentication failed: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    success = asyncio.run(setup_authentication())
    sys.exit(0 if success else 1)
