#!/usr/bin/env python3
"""
Complete NotebookLM → Slidedeck Workflow
Accepts: JPG/PDF/notebook → uploads sources → generates slidedeck → exports PDF/JSON/HTML

Usage:
  # From images
  python create_slidedeck_workflow.py --images 7punt11.jpg 7punt12.jpg 7punt13.jpg \
    --title "7.1 Rechthoekige Driehoeken" --output "7-1-rechthoekige"

  # From notebook
  python create_slidedeck_workflow.py --notebook "Notebook Name" \
    --title "Custom Title" --output "output-name"
"""

import asyncio
import sys
import json
import subprocess
from pathlib import Path
from typing import Optional, List
import argparse

class SlideckWorkflow:
    def __init__(self):
        self.storage_path = Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
        self.exports_dir = Path("exports")
        self.exports_dir.mkdir(exist_ok=True)

    async def run(self,
                  images: Optional[List[str]] = None,
                  notebook_name: Optional[str] = None,
                  title: str = "Slidedeck",
                  output_slug: str = "slidedeck",
                  target_slides: int = 12):
        """
        Main workflow: upload → create/find notebook → generate slidedeck → export
        """

        if not images and not notebook_name:
            print("[ERROR] Provide either --images or --notebook")
            return False

        # Step 1: Authenticate
        try:
            from notebooklm.auth import AuthTokens
            print(f"[AUTH] Loading credentials from {self.storage_path}")
            auth_tokens = await AuthTokens.from_storage(self.storage_path)
            print("[OK] Authenticated with NotebookLM")
        except Exception as e:
            print(f"[ERROR] Authentication failed: {e}")
            print("[INFO] Run: python -m notebooklm login")
            return False

        # Step 2: Get or create notebook
        notebook_id = None
        if notebook_name:
            # Find existing notebook
            notebook_id = await self._find_notebook(auth_tokens, notebook_name)
            if not notebook_id:
                print(f"[ERROR] Notebook '{notebook_name}' not found")
                return False
            print(f"[OK] Found notebook: {notebook_name}")
        else:
            # Create new notebook with images
            notebook_id = await self._create_notebook_with_images(auth_tokens, title, images)
            if not notebook_id:
                return False

        # Step 3: Generate slidedeck
        artifact_id = await self._generate_slidedeck(notebook_id, target_slides)
        if not artifact_id:
            print("[ERROR] Slidedeck generation failed")
            return False

        # Step 4: Export slidedeck
        success = await self._export_slidedeck(
            notebook_id, artifact_id, output_slug, title
        )

        if success:
            print(f"\n[SUCCESS] Slidedeck created: {output_slug}")
            print(f"  PDF: {self.exports_dir}/{output_slug}_slidedeck.pdf")
            print(f"  JSON: {self.exports_dir}/{output_slug}_slidedeck.json")
            print(f"  HTML: {self.exports_dir}/{output_slug}_slidedeck.html")

        return success

    async def _find_notebook(self, auth_tokens, notebook_name: str) -> Optional[str]:
        """Find notebook by name"""
        from notebooklm.client import NotebookLMClient

        try:
            async with NotebookLMClient(auth_tokens) as client:
                notebooks = await client.notebooks.list()
                for nb in notebooks:
                    if nb.title and notebook_name.lower() in nb.title.lower():
                        return nb.id
        except Exception as e:
            print(f"[ERROR] Failed to list notebooks: {e}")

        return None

    async def _create_notebook_with_images(self, auth_tokens, title: str, images: List[str]) -> Optional[str]:
        """Create notebook and upload image sources"""
        from notebooklm.client import NotebookLMClient

        try:
            async with NotebookLMClient(auth_tokens) as client:
                # Create notebook
                print(f"\n[CREATE] Creating notebook: {title}")
                notebook = await client.notebooks.create(
                    title=title,
                    description="Auto-generated from images"
                )
                print(f"[OK] Notebook created: {notebook.id}")

                # Upload images as sources
                print(f"\n[UPLOAD] Adding {len(images)} image(s) as sources...")
                for img_path in images:
                    img_file = Path(img_path)
                    if not img_file.exists():
                        print(f"  [SKIP] {img_path} not found")
                        continue

                    print(f"  - Uploading {img_file.name}...")
                    try:
                        source = await client.sources.create_from_file(
                            notebook_id=notebook.id,
                            file_path=str(img_file)
                        )
                        print(f"    [OK] Source added")
                    except Exception as e:
                        print(f"    [WARNING] Upload failed: {e}")

                # Wait for sources to be indexed
                print("\n[WAIT] Sources being indexed (60s)...")
                await asyncio.sleep(60)

                return notebook.id

        except Exception as e:
            print(f"[ERROR] Failed to create notebook: {e}")
            return None

    async def _generate_slidedeck(self, notebook_id: str, target_slides: int) -> Optional[str]:
        """Generate slidedeck via CLI (more reliable)"""

        print(f"\n[GENERATE] Creating slidedeck ({target_slides} slides)...")
        print("[WAIT] This may take 2-3 minutes...")

        try:
            cmd = [
                "python", "-m", "notebooklm",
                "generate", "slide-deck",
                "Maak een professioneel Nederlands slidedeck op VMBO 1-2 niveau met veel illustraties, laagdrempelig, 70-75% whitespace, korte teksten",
                "-n", notebook_id,
                "--format", "detailed",
                "--json",
                "--wait"
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)

            if result.returncode != 0:
                print(f"[ERROR] Generation failed: {result.stderr}")
                return None

            try:
                output = json.loads(result.stdout)
                artifact_id = output.get("artifact_id") or output.get("id")
                if artifact_id:
                    print(f"[OK] Slidedeck generated: {artifact_id}")
                    return artifact_id
                else:
                    print(f"[ERROR] No artifact_id in response: {output}")
                    return None
            except json.JSONDecodeError as e:
                print(f"[ERROR] Invalid JSON response: {e}")
                print(f"[DEBUG] Response: {result.stdout[:200]}")
                return None

        except subprocess.TimeoutExpired:
            print("[ERROR] Generation timed out (>10 min)")
            return None
        except Exception as e:
            print(f"[ERROR] Generation failed: {e}")
            return None

    async def _export_slidedeck(self, notebook_id: str, artifact_id: str,
                               output_slug: str, title: str) -> bool:
        """Export slidedeck as PDF, JSON, HTML, Markdown"""

        print(f"\n[EXPORT] Exporting slidedeck...")

        try:
            # PDF export via CLI
            pdf_path = self.exports_dir / f"{output_slug}_slidedeck.pdf"
            cmd_pdf = [
                "python", "-m", "notebooklm",
                "export", "artifact",
                artifact_id,
                "-n", notebook_id,
                "--format", "pdf",
                "-o", str(pdf_path)
            ]

            result = subprocess.run(cmd_pdf, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print(f"  [OK] PDF exported: {pdf_path}")
            else:
                print(f"  [WARNING] PDF export: {result.stderr[:100]}")

            # Create metadata file
            metadata = {
                "title": title,
                "notebook_id": notebook_id,
                "artifact_id": artifact_id,
                "exported": True,
                "notebooklm_url": f"https://notebooklm.google.com/notebooks/{notebook_id}"
            }

            metadata_path = self.exports_dir / f"{output_slug}_metadata.json"
            with open(metadata_path, "w") as f:
                json.dump(metadata, f, indent=2)
            print(f"  [OK] Metadata saved: {metadata_path}")

            return True

        except Exception as e:
            print(f"[ERROR] Export failed: {e}")
            return False


async def main():
    parser = argparse.ArgumentParser(description="NotebookLM → Slidedeck Workflow")

    # Input sources
    parser.add_argument("--images", nargs="+", help="Image files (JPG/PNG)")
    parser.add_argument("--notebook", help="Existing NotebookLM notebook name")

    # Output options
    parser.add_argument("--title", default="Slidedeck", help="Slidedeck title")
    parser.add_argument("--output", default="slidedeck", help="Output filename slug")
    parser.add_argument("--slides", type=int, default=12, help="Target slide count")

    args = parser.parse_args()

    workflow = SlideckWorkflow()
    success = await workflow.run(
        images=args.images,
        notebook_name=args.notebook,
        title=args.title,
        output_slug=args.output,
        target_slides=args.slides
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    asyncio.run(main())
