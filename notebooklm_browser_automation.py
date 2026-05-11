#!/usr/bin/env python3
"""
NotebookLM Browser Automation using Playwright/Chromium
Handles: login persistence, notebook source upload, slidedeck generation via GUI

Usage:
  from notebooklm_browser_automation import NotebookLMBrowser

  browser = NotebookLMBrowser()
  await browser.launch()
  pdf_path = await browser.generate_slidedeck(
      notebook_title="7.1 Rechthoekige Driehoeken",
      source_paths=["sources/combined.pdf"],
      output_dir="exports"
  )
  await browser.close()
"""

import asyncio
import sys
import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional, List
from urllib.parse import urljoin

try:
    from playwright.async_api import (
        async_playwright,
        Browser,
        BrowserContext,
        Page,
        Locator,
        TimeoutError as PlaywrightTimeoutError
    )
except ImportError:
    print("[ERROR] Playwright not installed. Run: pip install playwright && playwright install")
    sys.exit(1)


class NotebookLMBrowser:
    """Automated NotebookLM browser interactions"""

    def __init__(self, headless: bool = False, debug: bool = False):
        self.headless = headless
        self.debug = debug
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.context_dir = Path.home() / ".notebooklm" / "browser_context"
        self.context_dir.mkdir(parents=True, exist_ok=True)
        self.start_time = datetime.now()

    def log(self, msg: str, level: str = "INFO"):
        """Structured logging"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] [{level}] {msg}".encode('utf-8', errors='replace').decode('utf-8'))

    async def launch(self) -> bool:
        """Launch Chromium browser with persistent login context"""
        try:
            self.log("Launching Chromium browser...")
            self.playwright = await async_playwright().start()

            # Load or create persistent context
            context_state_file = self.context_dir / "state.json"

            if context_state_file.exists():
                self.log(f"Loading persistent browser context from {context_state_file}")
                self.browser = await self.playwright.chromium.launch(headless=self.headless)
                self.context = await self.browser.new_context(
                    storage_state=str(context_state_file)
                )
            else:
                self.log("Creating new browser context (no prior login found)")
                self.browser = await self.playwright.chromium.launch(headless=self.headless)
                self.context = await self.browser.new_context()

            self.page = await self.context.new_page()
            self.page.set_default_timeout(30000)  # 30s default timeout
            self.log("[OK] Browser launched")
            return True

        except Exception as e:
            self.log(f"[FAIL] Browser launch failed: {e}", "ERROR")
            return False

    async def ensure_logged_in(self) -> bool:
        """Navigate to NotebookLM and ensure we're logged in"""
        try:
            self.log("Navigating to NotebookLM...")
            await self.page.goto("https://notebooklm.google.com", wait_until="domcontentloaded")

            # Check if login is required
            await asyncio.sleep(2)  # Wait for any redirects

            current_url = self.page.url
            if "accounts.google.com" in current_url or "signin" in current_url.lower():
                self.log("Login required - please complete Google login in the browser window")
                self.log("Waiting for login completion (timeout: 300s)...", "INFO")

                # Wait for redirect back to notebooklm.google.com
                try:
                    await self.page.wait_for_url("https://notebooklm.google.com/**", timeout=300000)
                    self.log("[OK] Login successful")

                    # Save context for future use
                    await self.context.storage_state(
                        path=str(self.context_dir / "state.json")
                    )
                    self.log(f"[OK] Context saved for future use")
                    return True

                except PlaywrightTimeoutError:
                    self.log("Login timeout - user did not complete authentication", "ERROR")
                    return False
            else:
                self.log("[OK] Already logged in")

                # Save context anyway
                await self.context.storage_state(
                    path=str(self.context_dir / "state.json")
                )
                return True

        except Exception as e:
            self.log(f"[FAIL] Login check failed: {e}", "ERROR")
            return False

    async def find_or_create_notebook(self, title: str) -> Optional[str]:
        """Find existing notebook or create new one, return notebook ID"""
        try:
            self.log(f"Looking for notebook: {title}")

            # We're on the NotebookLM home page - check for existing notebooks
            await asyncio.sleep(1)

            # Try to find notebook in the list
            notebooks = await self.page.query_selector_all("a[href*='/notebooks/']")

            for notebook_link in notebooks:
                text = await notebook_link.text_content()
                if text and title.lower() in text.lower():
                    href = await notebook_link.get_attribute("href")
                    if href:
                        notebook_id = href.split("/notebooks/")[-1].split("/")[0]
                        self.log(f"[OK] Found existing notebook: {title} (ID: {notebook_id})")
                        return notebook_id

            # Notebook not found - create new one
            self.log(f"Notebook not found, creating new: {title}")

            # Look for "New notebook" or "Create" button
            create_button = await self.page.query_selector(
                "button:has-text('New notebook'), button:has-text('Create'), [aria-label*='New'], [aria-label*='Create']"
            )

            if create_button:
                await create_button.click()
                self.log("Clicked 'New notebook' button")
            else:
                # Try keyboard shortcut or direct navigation
                self.log("No create button found, trying direct navigation...")
                await self.page.goto("https://notebooklm.google.com")
                await asyncio.sleep(2)

            # Wait for dialog/input and enter title
            await asyncio.sleep(1)
            title_input = await self.page.query_selector("input[placeholder*='Title'], input[placeholder*='Name']")

            if title_input:
                await title_input.fill(title)
                self.log(f"Entered notebook title: {title}")

                # Find and click create/save button
                save_button = await self.page.query_selector(
                    "button:has-text('Create'), button:has-text('Save')"
                )
                if save_button:
                    await save_button.click()
                    self.log("Clicked create button")

            # Wait for notebook to load and get ID from URL
            await asyncio.sleep(2)
            current_url = self.page.url
            if "/notebooks/" in current_url:
                notebook_id = current_url.split("/notebooks/")[-1].split("/")[0]
                self.log(f"[OK] Notebook created: {title} (ID: {notebook_id})")
                return notebook_id

            self.log("[WARN] Could not determine notebook ID", "WARNING")
            return None

        except Exception as e:
            self.log(f"[FAIL] Notebook creation failed: {e}", "ERROR")
            return False

    async def open_notebook(self, notebook_id: str) -> bool:
        """Navigate to specific notebook"""
        try:
            notebook_url = f"https://notebooklm.google.com/notebooks/{notebook_id}"
            self.log(f"Opening notebook: {notebook_url}")

            await self.page.goto(notebook_url, wait_until="domcontentloaded")
            await asyncio.sleep(3)  # Wait for page to fully load

            # Verify we're in the notebook
            if notebook_id in self.page.url:
                self.log("[OK] Notebook loaded")
                return True
            else:
                self.log(f"[WARN] URL mismatch, expected {notebook_id} in URL", "WARNING")
                return False

        except Exception as e:
            self.log(f"[FAIL] Failed to open notebook: {e}", "ERROR")
            return False

    async def add_source_file(self, source_path: str) -> bool:
        """Upload source file via the GUI"""
        try:
            source_path = Path(source_path)
            if not source_path.exists():
                self.log(f"[FAIL] Source file not found: {source_path}", "ERROR")
                return False

            self.log(f"Adding source: {source_path.name}")

            # Look for "Add source" or upload button
            add_button = await self.page.query_selector(
                "button:has-text('Add source'), button:has-text('Upload'), [aria-label*='Add'], [aria-label*='Upload']"
            )

            if add_button:
                await add_button.click()
                self.log("Clicked 'Add source' button")
            else:
                self.log("[WARN] Could not find 'Add source' button, trying alternate method...", "WARNING")
                # Try looking for file input
                file_input = await self.page.query_selector("input[type='file']")
                if not file_input:
                    self.log("[FAIL] No file input found", "ERROR")
                    return False

            # Wait for file input to appear
            await asyncio.sleep(1)
            file_input = await self.page.query_selector("input[type='file']")

            if file_input:
                # Set file to upload
                await file_input.set_input_files(str(source_path))
                self.log(f"Selected file: {source_path.name}")

                # Wait for upload to complete (look for success indicator)
                await asyncio.sleep(5)  # Wait for upload processing

                # Check for upload completion
                success_indicator = await self.page.query_selector(
                    "[class*='success'], [class*='complete'], [aria-label*='Complete']"
                )

                if success_indicator or await self.page.query_selector(f"text='{source_path.name}'"):
                    self.log(f"[OK] Source uploaded: {source_path.name}")
                    return True
                else:
                    self.log(f"[WARN] Upload may have completed, continuing...", "WARNING")
                    return True

            else:
                self.log("[FAIL] File input not found", "ERROR")
                return False

        except Exception as e:
            self.log(f"[FAIL] Source upload failed: {e}", "ERROR")
            return False

    async def wait_for_source_processing(self, timeout_seconds: int = 300) -> bool:
        """Wait for sources to be processed/indexed"""
        try:
            self.log(f"Waiting for source processing (timeout: {timeout_seconds}s)...")

            start_time = datetime.now()

            while (datetime.now() - start_time).total_seconds() < timeout_seconds:
                # Look for processing indicator that disappears
                processing = await self.page.query_selector(
                    "[class*='processing'], [class*='loading'], [aria-label*='Processing']"
                )

                if not processing:
                    self.log("[OK] Source processing complete")
                    return True

                elapsed = int((datetime.now() - start_time).total_seconds())
                self.log(f"  Still processing ({elapsed}s elapsed)...")
                await asyncio.sleep(5)

            self.log(f"[WARN] Processing timeout after {timeout_seconds}s, continuing anyway...", "WARNING")
            return True

        except Exception as e:
            self.log(f"[WARN] Processing check failed: {e}", "WARNING")
            return True  # Continue anyway

    async def generate_slidedeck(self, notebook_id: str,
                                description: str = "Create a 12-slide educational slidedeck",
                                wait_for_completion: bool = True,
                                output_dir: str = "exports") -> Optional[str]:
        """Generate slidedeck via the GUI"""
        try:
            output_path = Path(output_dir)
            output_path.mkdir(exist_ok=True)

            self.log(f"Generating slidedeck...")

            # Look for "Generate" button or similar
            generate_button = await self.page.query_selector(
                "button:has-text('Generate'), button:has-text('Create'), [aria-label*='Generate']"
            )

            if not generate_button:
                self.log("[FAIL] No 'Generate' button found", "ERROR")
                return None

            await generate_button.click()
            self.log("Clicked 'Generate' button")
            await asyncio.sleep(2)

            # Select slidedeck option if menu appears
            slidedeck_option = await self.page.query_selector(
                "button:has-text('Slidedeck'), [role='option']:has-text('Slidedeck')"
            )

            if slidedeck_option:
                await slidedeck_option.click()
                self.log("Selected 'Slidedeck' generation type")
                await asyncio.sleep(2)

            # Enter description if prompted
            description_input = await self.page.query_selector("textarea, input[placeholder*='description']")
            if description_input:
                await description_input.fill(description)
                self.log("Entered generation description")

            # Click final confirm button
            confirm_button = await self.page.query_selector(
                "button:has-text('Generate'), button:has-text('Create'), button:has-text('Confirm')"
            )
            if confirm_button:
                await confirm_button.click()
                self.log("Confirmed generation")

            if wait_for_completion:
                await asyncio.sleep(5)  # Wait for generation to start
                self.log("Waiting for slidedeck generation to complete...", "INFO")

                # Poll for completion (look for download button or success indicator)
                start_time = datetime.now()
                timeout = 600  # 10 minutes

                while (datetime.now() - start_time).total_seconds() < timeout:
                    # Look for download button or completion indicator
                    download_button = await self.page.query_selector(
                        "button:has-text('Download'), [aria-label*='Download'], [aria-label*='Export']"
                    )

                    if download_button:
                        self.log("[OK] Slidedeck generation complete, download available")
                        return await self.download_pdf(notebook_id, output_dir)

                    elapsed = int((datetime.now() - start_time).total_seconds())
                    self.log(f"  Generating... ({elapsed}s elapsed)")
                    await asyncio.sleep(10)

                self.log(f"[WARN] Generation timeout after {timeout}s", "WARNING")

            return None

        except Exception as e:
            self.log(f"[FAIL] Slidedeck generation failed: {e}", "ERROR")
            return None

    async def download_pdf(self, notebook_id: str, output_dir: str = "exports") -> Optional[str]:
        """Download generated PDF"""
        try:
            output_path = Path(output_dir)
            output_path.mkdir(exist_ok=True)

            self.log(f"Downloading PDF...")

            # Setup download handler
            download_path = output_path / f"slidedeck_{notebook_id}.pdf"

            # Accept downloads in this context
            async with self.context.expect_download() as download_info:
                # Look for download button
                download_button = await self.page.query_selector(
                    "button:has-text('Download'), [aria-label*='Download'], a[href*='download']"
                )

                if download_button:
                    await download_button.click()
                    self.log("Clicked download button")
                else:
                    self.log("[WARN] No download button found", "WARNING")
                    return None

                download = await download_info.value
                await download.save_as(str(download_path))

            if download_path.exists():
                size_mb = download_path.stat().st_size / (1024 * 1024)
                self.log(f"[OK] PDF downloaded: {download_path} ({size_mb:.1f}MB)")
                return str(download_path)
            else:
                self.log("[FAIL] PDF file not created after download", "ERROR")
                return None

        except Exception as e:
            self.log(f"[FAIL] PDF download failed: {e}", "ERROR")
            return None

    async def close(self):
        """Close browser and cleanup"""
        try:
            if self.context:
                # Save context for next time
                await self.context.storage_state(
                    path=str(self.context_dir / "state.json")
                )
                await self.context.close()

            if self.browser:
                await self.browser.close()

            if self.playwright:
                await self.playwright.stop()

            self.log("[OK] Browser closed")

        except Exception as e:
            self.log(f"[WARN] Error during cleanup: {e}", "WARNING")

    async def full_workflow(self, title: str, source_files: List[str],
                           output_dir: str = "exports") -> Optional[str]:
        """Complete workflow: launch → login → notebook → sources → generate → download"""
        try:
            # 1. Launch
            if not await self.launch():
                return None

            # 2. Ensure logged in
            if not await self.ensure_logged_in():
                await self.close()
                return None

            # 3. Find or create notebook
            notebook_id = await self.find_or_create_notebook(title)
            if not notebook_id:
                await self.close()
                return None

            # 4. Open notebook
            if not await self.open_notebook(notebook_id):
                await self.close()
                return None

            # 5. Add sources
            self.log(f"\n[STEP 5] Adding {len(source_files)} source(s)...")
            for source_path in source_files:
                if not await self.add_source_file(source_path):
                    self.log(f"[WARN] Failed to add source: {source_path}", "WARNING")

            # 6. Wait for processing
            self.log(f"\n[STEP 6] Processing sources...")
            await self.wait_for_source_processing()

            # 7. Generate slidedeck
            self.log(f"\n[STEP 7] Generating slidedeck...")
            description = f"Create a 12-slide professional Dutch educational slidedeck at VMBO 1-2 level for {title}. Include simple language and clear diagrams."

            pdf_path = await self.generate_slidedeck(
                notebook_id,
                description=description,
                wait_for_completion=True,
                output_dir=output_dir
            )

            await self.close()
            return pdf_path

        except Exception as e:
            self.log(f"[FAIL] Workflow failed: {e}", "ERROR")
            await self.close()
            return None


async def main():
    """Test the browser automation"""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python notebooklm_browser_automation.py <notebook_title> <source_file> [source_file2...]")
        print("Example: python notebooklm_browser_automation.py '7.1 Rechthoekige' sources/combined.pdf")
        return

    title = sys.argv[1]
    source_files = sys.argv[2:]

    browser = NotebookLMBrowser(headless=False, debug=True)
    pdf_path = await browser.full_workflow(title, source_files)

    if pdf_path:
        print(f"\n[OK] Complete! PDF: {pdf_path}")
    else:
        print("[FAIL] Workflow incomplete")


if __name__ == "__main__":
    asyncio.run(main())
