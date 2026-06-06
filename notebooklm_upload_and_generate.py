#!/usr/bin/env python3
"""
NotebookLM Automatic Upload & Slidedeck Generation
Accepts: PDF/JPG/PNG/text → Creates/finds notebook → Uploads sources → Generates slidedeck → Exports

Usage:
  # Single image
  python notebooklm_upload_and_generate.py --source @boek.jpg --title "Lesson 7.1" --slides 12

  # Multiple images (auto-combines to PDF)
  python notebooklm_upload_and_generate.py --source @img1.jpg @img2.jpg @img3.jpg --title "Lesson 7.1"

  # Existing notebook
  python notebooklm_upload_and_generate.py --notebook-id "abc123..." --title "Custom Title"

  # Text source
  python notebooklm_upload_and_generate.py --source-text "Dit is een lesbeschrijving..." --title "Lesson 7.1"
"""

import asyncio
import sys
import json
import subprocess
import time
import argparse
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Tuple
try:
    from PIL import Image
except ImportError:
    Image = None

# Try to import browser automation (optional fallback)
try:
    from notebooklm_browser_automation import NotebookLMBrowser
    BROWSER_AUTOMATION_AVAILABLE = True
except ImportError:
    BROWSER_AUTOMATION_AVAILABLE = False


def should_abort_source_stage(production_mode: bool,
                              upload_results: Optional[List[bool]],
                              source_count: int,
                              sources_ready: bool) -> Tuple[bool, str]:
    """Return whether source validation should stop the workflow."""
    if not production_mode:
        return False, ""

    if upload_results and not all(upload_results):
        return True, "upload_failed"

    if source_count == 0:
        return True, "zero_sources"

    if sources_ready is False:
        return True, "sources_not_ready"

    return False, ""


class NotebookLMWorkflow:
    """Complete NotebookLM notebook → sources → slidedeck workflow"""

    def __init__(self):
        self.storage_path = Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
        self.exports_dir = Path("exports")
        self.sources_dir = Path("sources")
        self.exports_dir.mkdir(exist_ok=True)
        self.sources_dir.mkdir(exist_ok=True)
        self.start_time = datetime.now()

    def log(self, msg: str, level: str = "INFO"):
        """Structured logging"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] [{level}] {msg}".encode('utf-8', errors='replace').decode('utf-8'))

    async def authenticate(self) -> bool:
        """Verify NotebookLM authentication"""
        try:
            from notebooklm.auth import AuthTokens

            self.log(f"Verifying credentials at {self.storage_path}")
            await AuthTokens.from_storage(self.storage_path)
            self.log("[OK] Authenticated with NotebookLM")
            return True
        except Exception as e:
            self.log(f"[FAIL] Authentication failed: {e}", "ERROR")
            self.log("Run: python -m notebooklm login", "INFO")
            return False

    async def list_notebooks(self) -> List[Tuple[str, str]]:
        """Get all notebooks (returns list of (id, title) tuples)"""
        try:
            result = subprocess.run(
                ["python", "notebooklm_cli.py", "list"],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode != 0:
                self.log(f"Failed to list notebooks: {result.stderr[:100]}", "ERROR")
                return []

            notebooks = []
            for line in result.stdout.split("\n"):
                if " (ID: " in line:
                    parts = line.split(" (ID: ")
                    if len(parts) == 2:
                        title = parts[0].strip().replace("- ", "")
                        notebook_id = parts[1].rstrip(")")
                        notebooks.append((notebook_id, title))

            return notebooks
        except Exception as e:
            self.log(f"Error listing notebooks: {e}", "ERROR")
            return []

    async def find_notebook(self, query: str) -> Optional[str]:
        """Find notebook by ID or partial name match"""
        notebooks = await self.list_notebooks()

        # Exact ID match
        for nb_id, title in notebooks:
            if nb_id == query:
                self.log(f"[OK] Found notebook by ID: {title} ({nb_id})")
                return nb_id

        # Partial name match
        query_lower = query.lower()
        for nb_id, title in notebooks:
            if query_lower in title.lower():
                self.log(f"[OK] Found notebook by name: {title} ({nb_id})")
                return nb_id

        return None

    async def create_notebook(self, title: str) -> Optional[str]:
        """Create a new NotebookLM notebook"""
        self.log(f"Creating notebook: {title}")

        try:
            from notebooklm.auth import AuthTokens
            from notebooklm.client import NotebookLMClient

            auth_tokens = await AuthTokens.from_storage(self.storage_path)

            async with NotebookLMClient(auth_tokens) as client:
                notebook = await client.notebooks.create(title=title)

                self.log(f"[OK] Notebook created: {notebook.id}")

                # Verify it appears in list
                await asyncio.sleep(2)
                found = await self.find_notebook(notebook.id)
                if found:
                    self.log(f"[OK] Notebook verified in list")
                    return notebook.id
                else:
                    self.log(f"[WARN] Notebook not immediately visible in list (may need refresh)", "WARNING")
                    return notebook.id

        except Exception as e:
            self.log(f"[FAIL] Failed to create notebook: {e}", "ERROR")
            return None

    async def find_or_create_notebook(self, title: str, notebook_id: Optional[str] = None) -> Optional[str]:
        """Find existing or create new notebook"""

        if notebook_id:
            self.log(f"Looking for notebook ID: {notebook_id}")
            found_id = await self.find_notebook(notebook_id)
            if found_id:
                return found_id
            self.log(f"Notebook ID not found, proceeding with title", "WARNING")

        found_id = await self.find_notebook(title)
        if found_id:
            self.log(f"Using existing notebook: {title}")
            return found_id

        self.log(f"Notebook not found, creating new: {title}")
        return await self.create_notebook(title)

    def combine_images_to_pdf(self, image_paths: List[str], output_slug: str) -> Optional[str]:
        """Combine multiple JPG/PNG images into single PDF"""
        if not Image:
            self.log("Pillow not installed, skipping image combination", "WARNING")
            return None

        if len(image_paths) == 1:
            # Single image - just return it
            return image_paths[0]

        self.log(f"Combining {len(image_paths)} images into PDF...")

        try:
            images = []
            for img_path in image_paths:
                img = Image.open(img_path)
                if img.mode != "RGB":
                    img = img.convert("RGB")
                images.append(img)

            output_path = self.sources_dir / f"{output_slug}_combined.pdf"
            images[0].save(output_path, save_all=True, append_images=images[1:])

            self.log(f"[OK] Combined PDF created: {output_path}")
            return str(output_path)

        except Exception as e:
            self.log(f"[FAIL] Image combination failed: {e}", "ERROR")
            return None

    async def prepare_sources(self,
                             source_files: Optional[List[str]] = None,
                             source_text: Optional[str] = None,
                             output_slug: str = "slidedeck") -> Optional[List[str]]:
        """Prepare source file(s) for upload"""
        sources = []

        if source_text:
            # Save text as file
            text_path = self.sources_dir / f"{output_slug}_text.txt"
            with open(text_path, "w", encoding="utf-8") as f:
                f.write(source_text)
            self.log(f"[OK] Text source saved: {text_path}")
            sources.append(str(text_path))

        if source_files:
            image_files = []
            pdf_files = []

            for src in source_files:
                src_path = Path(src)
                if not src_path.exists():
                    self.log(f"[FAIL] Source not found: {src}", "ERROR")
                    continue

                if src_path.suffix.lower() in [".jpg", ".jpeg", ".png"]:
                    image_files.append(str(src_path))
                elif src_path.suffix.lower() == ".pdf":
                    pdf_files.append(str(src_path))
                else:
                    self.log(f"[WARN] Unknown file type: {src}", "WARNING")

            # Combine images to PDF if multiple
            if len(image_files) > 1:
                combined_pdf = self.combine_images_to_pdf(image_files, output_slug)
                if combined_pdf:
                    sources.append(combined_pdf)
                else:
                    sources.extend(image_files)
            elif len(image_files) == 1:
                sources.extend(image_files)

            sources.extend(pdf_files)

        if not sources:
            self.log("[FAIL] No valid sources provided", "ERROR")
            return None

        return sources

    async def upload_source(self, notebook_id: str, source_path: str) -> bool:
        """Upload source file to notebook via CLI"""
        source_path = Path(source_path)

        if not source_path.exists():
            self.log(f"[FAIL] Source file not found: {source_path}", "ERROR")
            return False

        self.log(f"Uploading source: {source_path.name} to notebook {notebook_id}")

        try:
            # Use CLI to upload source
            result = subprocess.run(
                [
                    "python", "-m", "notebooklm",
                    "source", "add",
                    str(source_path),
                    "-n", notebook_id,
                    "--type", "file",
                    "--json"
                ],
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                self.log(f"[OK] Source uploaded: {source_path.name}")
                return True
            else:
                self.log(f"[FAIL] Upload error: {result.stderr[:200]}", "ERROR")
                return False

        except subprocess.TimeoutExpired:
            self.log(f"[FAIL] Upload timeout", "ERROR")
            return False
        except Exception as e:
            self.log(f"[FAIL] Source upload failed: {e}", "ERROR")
            return False

    async def verify_sources_present(self, notebook_id: str) -> int:
        """Verify sources exist in notebook and return count"""
        try:
            result = subprocess.run(
                [
                    "python", "-m", "notebooklm",
                    "source", "list",
                    "-n", notebook_id,
                    "--json"
                ],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                try:
                    output = json.loads(result.stdout)
                    # Check various response formats
                    sources = output if isinstance(output, list) else output.get("sources", [])
                    count = len(sources)
                    self.log(f"[OK] Found {count} source(s) in notebook")
                    for i, source in enumerate(sources[:5], 1):
                        title = source.get("title") if isinstance(source, dict) else str(source)
                        self.log(f"    {i}. {title}")
                    return count
                except json.JSONDecodeError:
                    self.log(f"[WARN] Could not parse source list", "WARNING")
                    return -1
            else:
                self.log(f"[WARN] Failed to list sources: {result.stderr[:100]}", "WARNING")
                return -1

        except Exception as e:
            self.log(f"[WARN] Verify sources failed: {e}", "WARNING")
            return -1

    async def wait_for_sources_ready(self, notebook_id: str,
                                    timeout_seconds: int = 600,
                                    interval_seconds: int = 15) -> bool:
        """Poll until sources are processed"""
        self.log(f"Waiting for source processing (timeout: {timeout_seconds}s)...")

        start_time = time.time()
        attempt = 0

        while time.time() - start_time < timeout_seconds:
            attempt += 1
            elapsed = int(time.time() - start_time)
            self.log(f"  Attempt {attempt} ({elapsed}s elapsed)...")

            # Try to generate a test artifact to check if sources are ready
            result = subprocess.run(
                [
                    "python", "-m", "notebooklm",
                    "generate", "slide-deck",
                    "Test generation to verify sources are ready",
                    "-n", notebook_id,
                    "--format", "detailed",
                    "--json"
                ],
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                try:
                    output = json.loads(result.stdout)
                    if output.get("artifact_id") or output.get("id"):
                        self.log(f"[OK] Sources are ready (attempt {attempt})")
                        return True
                except json.JSONDecodeError:
                    pass

            await asyncio.sleep(interval_seconds)

        self.log(f"[FAIL] Source processing timeout after {timeout_seconds}s", "ERROR")
        return False

    async def generate_slidedeck_with_retry(self, notebook_id: str,
                                           description: str,
                                           max_attempts: int = 8) -> Optional[str]:
        """Generate slidedeck with retry on failure"""
        self.log(f"Generating slidedeck (max {max_attempts} attempts)...")

        for attempt in range(1, max_attempts + 1):
            self.log(f"  Attempt {attempt}/{max_attempts}...")

            try:
                result = subprocess.run(
                    [
                        "python", "-m", "notebooklm",
                        "generate", "slide-deck",
                        description,
                        "-n", notebook_id,
                        "--format", "detailed",
                        "--json",
                        "--wait"
                    ],
                    capture_output=True,
                    text=True,
                    timeout=600
                )

                if result.returncode == 0:
                    output = json.loads(result.stdout)
                    artifact_id = output.get("artifact_id") or output.get("id")

                    if artifact_id:
                        self.log(f"[OK] Slidedeck generated: {artifact_id}")
                        return artifact_id

                # No artifact_id, retry
                if attempt < max_attempts:
                    wait_time = 20 + (attempt * 10)
                    self.log(f"  No artifact_id, waiting {wait_time}s before retry...")
                    await asyncio.sleep(wait_time)

            except json.JSONDecodeError:
                if attempt < max_attempts:
                    self.log(f"  Invalid response, retrying in 30s...")
                    await asyncio.sleep(30)
            except subprocess.TimeoutExpired:
                if attempt < max_attempts:
                    self.log(f"  Timeout, retrying...")
                    await asyncio.sleep(30)
            except Exception as e:
                self.log(f"  Error: {e}", "WARNING")
                if attempt < max_attempts:
                    await asyncio.sleep(30)

        self.log(f"[FAIL] Failed to generate slidedeck after {max_attempts} attempts", "ERROR")
        return None

    async def generate_via_browser_automation(self, notebook_id: str, title: str,
                                             sources: List[str]) -> Optional[str]:
        """Fallback: Generate slidedeck via browser automation (Chromium/Playwright)"""
        if not BROWSER_AUTOMATION_AVAILABLE:
            self.log("[FAIL] Browser automation not available (notebooklm_browser_automation module missing)", "ERROR")
            return None

        self.log("\n[STEP 7B] API generation failed - switching to browser automation...")
        self.log("[INFO] This will open Chromium and automate the NotebookLM GUI")

        try:
            browser = NotebookLMBrowser(headless=False, debug=False)

            # Launch and run workflow
            pdf_path = await browser.full_workflow(
                title=title,
                source_files=sources,
                output_dir=str(self.exports_dir)
            )

            if pdf_path and Path(pdf_path).exists():
                self.log(f"[OK] Browser automation successful: {pdf_path}")
                return pdf_path
            else:
                self.log("[FAIL] Browser automation did not produce PDF", "ERROR")
                return None

        except Exception as e:
            self.log(f"[FAIL] Browser automation failed: {e}", "ERROR")
            return None

    async def export_outputs(self, notebook_id: str, artifact_id: str,
                            slug: str, title: str) -> bool:
        """Export slidedeck as PDF and create metadata"""
        self.log(f"Exporting outputs...")

        try:
            # PDF export
            pdf_path = self.exports_dir / f"{slug}_slidedeck.pdf"

            result = subprocess.run(
                [
                    "python", "-m", "notebooklm",
                    "export", "artifact",
                    artifact_id,
                    "-n", notebook_id,
                    "--format", "pdf",
                    "-o", str(pdf_path)
                ],
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0 and pdf_path.exists():
                self.log(f"[OK] PDF exported: {pdf_path}")
            else:
                self.log(f"[WARN] PDF export may have failed, continuing...", "WARNING")

            # Metadata JSON
            metadata = {
                "title": title,
                "notebook_id": notebook_id,
                "artifact_id": artifact_id,
                "generated_at": datetime.now().isoformat(),
                "exports": {
                    "pdf": str(pdf_path),
                    "json": str(self.exports_dir / f"{slug}_slidedeck.json"),
                    "html": str(self.exports_dir / f"{slug}_slidedeck.html"),
                    "metadata": str(self.exports_dir / f"{slug}_metadata.json")
                },
                "status": "READY",
                "notebooklm_url": f"https://notebooklm.google.com/notebooks/{notebook_id}",
                "notes": [
                    "PDF exported from NotebookLM",
                    "Further processing (HTML/JSON) may require additional manual steps",
                    "Notebook accessible at NotebookLM URL above"
                ]
            }

            metadata_path = self.exports_dir / f"{slug}_metadata.json"
            with open(metadata_path, "w") as f:
                json.dump(metadata, f, indent=2)
            self.log(f"[OK] Metadata saved: {metadata_path}")

            return True

        except Exception as e:
            self.log(f"[FAIL] Export failed: {e}", "ERROR")
            return False

    async def run(self, title: str, slides: int = 12, questions: int = 4,
                 source_files: Optional[List[str]] = None,
                 source_text: Optional[str] = None,
                 notebook_id: Optional[str] = None,
                 production_mode: bool = False) -> bool:
        """Run complete workflow"""

        self.log("=== NotebookLM Slidedeck Workflow ===")
        self.log(f"Title: {title}")
        self.log(f"Target slides: {slides}")
        self.log(f"Questions: {questions}")

        # 1. Authenticate
        if not await self.authenticate():
            return False

        # 2. Prepare sources
        if not source_files and not source_text and not notebook_id:
            self.log("[FAIL] No sources or notebook provided", "ERROR")
            return False

        sources = None
        if source_files or source_text:
            output_slug = title.lower().replace(" ", "-")
            sources = await self.prepare_sources(source_files, source_text, output_slug)
            if not sources:
                return False

        # 3. Find or create notebook
        nb_id = await self.find_or_create_notebook(title, notebook_id)
        if not nb_id:
            return False

        # 4. Upload sources
        if sources:
            self.log(f"\n[STEP 4] Uploading {len(sources)} source(s)...")
            upload_results = []
            for source_path in sources:
                upload_ok = await self.upload_source(nb_id, source_path)
                upload_results.append(upload_ok)
                if not upload_ok:
                    if production_mode:
                        self.log(f"[WARN] Failed to upload {source_path}; production mode will stop.", "WARNING")
                    else:
                        self.log(f"[WARN] Failed to upload {source_path}, continuing anyway...", "WARNING")

            should_abort, reason = should_abort_source_stage(
                production_mode=production_mode,
                upload_results=upload_results,
                source_count=-1,
                sources_ready=True
            )
            if should_abort:
                self.log(f"[FAIL] Production mode stopped after source upload validation: {reason}", "ERROR")
                return False

            # 5. Verify sources are present
            self.log(f"\n[STEP 5] Verifying sources...")
            source_count = await self.verify_sources_present(nb_id)
            if source_count <= 0:
                if production_mode and source_count == 0:
                    self.log(f"[WARN] No sources found; production mode will stop.", "WARNING")
                else:
                    self.log(f"[WARN] No sources found, attempting generation anyway...", "WARNING")
            should_abort, reason = should_abort_source_stage(
                production_mode=production_mode,
                upload_results=upload_results,
                source_count=source_count,
                sources_ready=True
            )
            if should_abort:
                self.log(f"[FAIL] Production mode stopped after source count validation: {reason}", "ERROR")
                return False

            # 6. Wait for processing
            self.log(f"\n[STEP 6] Waiting for source processing...")
            sources_ready = await self.wait_for_sources_ready(nb_id)
            if not sources_ready:
                if production_mode:
                    self.log("[WARN] Timeout waiting for sources; production mode will stop.", "WARNING")
                else:
                    self.log("[WARN] Timeout waiting for sources, attempting generation anyway...", "WARNING")
            should_abort, reason = should_abort_source_stage(
                production_mode=production_mode,
                upload_results=upload_results,
                source_count=source_count,
                sources_ready=sources_ready
            )
            if should_abort:
                self.log(f"[FAIL] Production mode stopped after source processing validation: {reason}", "ERROR")
                return False

        # 7. Generate slidedeck
        self.log(f"\n[STEP 7] Generating slidedeck...")
        description = (
            f"Create a {slides}-slide professional Dutch educational slidedeck at VMBO 1-2 level. "
            f"Include {questions} practice questions. "
            f"Use laagdrempelijk language (simple words, short sentences, daily examples). "
            f"75% whitespace on many slides. Max 2-3 lines of text per slide. "
            f"Large, clear diagrams preferred over text."
        )

        artifact_id = await self.generate_slidedeck_with_retry(nb_id, description)

        # If API generation failed, try browser automation fallback
        if not artifact_id:
            self.log(f"\n[FALLBACK] API generation failed, attempting browser automation...")

            if BROWSER_AUTOMATION_AVAILABLE:
                # Browser automation fallback - generate PDF directly via GUI
                pdf_path = await self.generate_via_browser_automation(nb_id, title, sources or [])
                if pdf_path:
                    # Move/copy PDF to exports if needed
                    output_slug = title.lower().replace(" ", "-")
                    final_pdf = self.exports_dir / f"{output_slug}_slidedeck.pdf"
                    if Path(pdf_path) != final_pdf:
                        import shutil
                        shutil.copy(pdf_path, final_pdf)
                    self.log(f"[OK] PDF ready: {final_pdf}")

                    # Create metadata
                    metadata = {
                        "title": title,
                        "notebook_id": nb_id,
                        "method": "browser_automation",
                        "generated_at": datetime.now().isoformat(),
                        "exports": {
                            "pdf": str(final_pdf),
                        },
                        "status": "READY",
                        "notes": [
                            "PDF generated via browser automation (Chromium/Playwright)",
                            "Notebook accessible at: https://notebooklm.google.com/notebooks/" + nb_id
                        ]
                    }
                    metadata_path = self.exports_dir / f"{output_slug}_metadata.json"
                    with open(metadata_path, "w") as f:
                        json.dump(metadata, f, indent=2)

                    elapsed = int((datetime.now() - self.start_time).total_seconds())
                    self.log(f"\n[OK] Workflow completed in {elapsed}s")
                    self.log(f"[OK] Check exports at: {self.exports_dir}/")
                    return True
                else:
                    self.log("[FAIL] Browser automation fallback also failed", "ERROR")
                    return False
            else:
                self.log("[FAIL] Browser automation not available - install with: pip install playwright", "ERROR")
                self.log("[INFO] Then run: playwright install", "INFO")
                return False

        # 8. Export (API method succeeded)
        self.log(f"\n[STEP 8] Exporting outputs...")
        output_slug = title.lower().replace(" ", "-")
        if not await self.export_outputs(nb_id, artifact_id, output_slug, title):
            self.log("[WARN] Export completed with warnings", "WARNING")

        # Summary
        elapsed = int((datetime.now() - self.start_time).total_seconds())
        self.log(f"\n[OK] Workflow completed in {elapsed}s")
        self.log(f"[OK] Check exports at: {self.exports_dir}/")

        return True


async def main():
    parser = argparse.ArgumentParser(
        description="NotebookLM Automatic Slidedeck Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single image
  python notebooklm_upload_and_generate.py --source @boek.jpg --title "Lesson 7.1"

  # Multiple images
  python notebooklm_upload_and_generate.py --source @img1.jpg @img2.jpg @img3.jpg --title "Lesson 7.1"

  # Existing notebook
  python notebooklm_upload_and_generate.py --notebook-id "abc123..." --title "Custom Title"

  # Text source
  python notebooklm_upload_and_generate.py --source-text "Dit is een lesparagraaf..." --title "Lesson 7.1"
        """
    )

    # Source options
    parser.add_argument("--source", nargs="+", help="Source file(s): PDF, JPG, PNG")
    parser.add_argument("--source-text", help="Text source (method paragraph)")
    parser.add_argument("--notebook-id", help="Use existing notebook by ID")

    # Output options
    parser.add_argument("--title", required=True, help="Slidedeck title / notebook name")
    parser.add_argument("--slides", type=int, default=12, help="Target slide count")
    parser.add_argument("--questions", type=int, default=4, help="Practice questions")
    parser.add_argument(
        "--production",
        action="store_true",
        help="Stop when any source upload fails, when zero sources are present, or when source processing times out"
    )

    args = parser.parse_args()

    if not args.source and not args.source_text and not args.notebook_id:
        parser.error("Provide at least one of: --source, --source-text, --notebook-id")

    workflow = NotebookLMWorkflow()
    success = await workflow.run(
        title=args.title,
        slides=args.slides,
        questions=args.questions,
        source_files=args.source,
        source_text=args.source_text,
        notebook_id=args.notebook_id,
        production_mode=args.production
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    asyncio.run(main())
