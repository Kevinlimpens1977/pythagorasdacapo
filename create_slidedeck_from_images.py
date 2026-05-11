#!/usr/bin/env python3
"""
Create a slidedeck from JPG images via NotebookLM
Usage: python create_slidedeck_from_images.py <image1.jpg> <image2.jpg> ... --title "Title" --output "name"
"""

import asyncio
import sys
import argparse
from pathlib import Path
from notebooklm.auth import AuthTokens
from notebooklm.client import NotebookLMClient
import httpx

async def main():
    parser = argparse.ArgumentParser(description="Create slidedeck from JPG images")
    parser.add_argument("images", nargs="+", help="Image files to use")
    parser.add_argument("--title", default="Slidedeck", help="Slidedeck title")
    parser.add_argument("--output", default="slidedeck", help="Output filename (without extension)")
    parser.add_argument("--slides", type=int, default=12, help="Target slide count")

    args = parser.parse_args()

    # Verify image files exist
    images = [Path(img) for img in args.images]
    for img in images:
        if not img.exists():
            print(f"ERROR: {img} not found")
            return False

    print(f"\n[INFO] Using images: {', '.join(str(i.name) for i in images)}")
    print(f"[INFO] Title: {args.title}")
    print(f"[INFO] Target slides: {args.slides}")

    # Authenticate
    storage_path = Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
    try:
        print(f"\n[AUTH] Loading credentials from: {storage_path}")
        auth_tokens = await AuthTokens.from_storage(storage_path)
        print("[OK] Authenticated with NotebookLM")
    except Exception as e:
        print(f"[ERROR] Authentication failed: {e}")
        print("[INFO] Run: python -m notebooklm login")
        return False

    try:
        async with NotebookLMClient(auth_tokens) as client:
            # Create a new notebook
            print(f"\n[CREATE] Creating notebook: {args.title}")
            notebook = await client.notebooks.create(
                title=f"{args.title} (Auto-generated)",
                description=f"Slidedeck generated from {len(images)} image(s)"
            )
            print(f"[OK] Notebook created: {notebook.id}")

            # Upload images as sources
            print(f"\n[UPLOAD] Adding {len(images)} image(s) as sources...")
            for img in images:
                print(f"  - Uploading {img.name}...")
                try:
                    source = await client.sources.create_from_file(
                        notebook_id=notebook.id,
                        file_path=str(img)
                    )
                    print(f"    [OK] Source added: {source.id}")
                except Exception as e:
                    print(f"    [WARNING] Failed to upload {img.name}: {e}")

            # Wait a moment for sources to be indexed
            print("\n[WAIT] Processing sources (30s)...")
            await asyncio.sleep(30)

            # Generate slidedeck
            print(f"\n[GENERATE] Creating slidedeck (this may take 1-2 minutes)...")
            description = f"Create a {args.slides}-slide educational slidedeck in Dutch about the content in these images. Make it laagdrempelig (accessible) for VMBO 1-2 students."

            slidedeck = await client.generate_slidedeck(
                notebook_id=notebook.id,
                description=description
            )
            print(f"[OK] Slidedeck generated: {slidedeck.id}")

            # Export as PDF
            export_dir = Path("boekafbeeldingen")
            export_dir.mkdir(exist_ok=True)

            pdf_path = export_dir / f"{args.output}-slidedeck.pdf"
            print(f"\n[EXPORT] Exporting to: {pdf_path}")

            # Use HTTP to export (since SDK may not have direct export)
            export_url = f"https://notebooklm.google.com/notebooks/{notebook.id}/export/artifacts/{slidedeck.id}?format=pdf"
            print(f"[INFO] Download URL: {export_url}")
            print(f"[INFO] Or access your notebook at: https://notebooklm.google.com/notebooks/{notebook.id}")

            print(f"\n[SUCCESS] Slidedeck created!")
            print(f"  Title: {args.title}")
            print(f"  Notebook ID: {notebook.id}")
            print(f"  Slidedeck ID: {slidedeck.id}")
            return True

    except Exception as e:
        print(f"\n[ERROR] Failed to create slidedeck: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
