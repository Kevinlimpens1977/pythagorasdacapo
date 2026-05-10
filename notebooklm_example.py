#!/usr/bin/env python3
"""
Example: How to use NotebookLM + Claude integration

After running: python -m notebooklm login
You can use this script to:
1. Create slide decks from your notebooks
2. Export them as PDFs
3. Upload to your learning platform
"""

import asyncio
from notebooklm_integration import NotebookLMIntegration
from pathlib import Path

async def example_create_and_export_slidedeck():
    """Example: Create a slide deck and export as PDF"""

    integration = NotebookLMIntegration()

    if not await integration.authenticate():
        print("[ERROR] Please run: python -m notebooklm login")
        return

    print("\n[STEP 1] Listing your notebooks...")
    notebooks = await integration.list_notebooks()

    if not notebooks:
        print("[ERROR] No notebooks found")
        return

    # Use the first notebook with a title
    notebook_id = None
    notebook_title = None
    for nb in notebooks:
        if nb.title:
            notebook_id = nb.id
            notebook_title = nb.title
            break

    if not notebook_id:
        print("[ERROR] No notebooks with titles found")
        return

    print(f"\n[STEP 2] Using notebook: {notebook_title}")

    print("[STEP 3] Creating slide deck...")
    artifact_id = integration.create_slidedeck(
        notebook_id=notebook_id,
        description="Generate comprehensive slide deck with key concepts"
    )

    if not artifact_id:
        return

    print("[STEP 4] Exporting as PDF...")
    pdf_path = integration.export_artifact_as_pdf(
        notebook_id=notebook_id,
        artifact_id=artifact_id,
        output_path=Path("./exports")
    )

    if pdf_path:
        print(f"\n[SUCCESS] PDF ready: {pdf_path}")
        print(f"[INFO] Next step: Upload this to your learning platform")


async def example_with_platform_upload():
    """Example: Create slide deck and upload to your learning platform"""

    integration = NotebookLMIntegration()

    if not await integration.authenticate():
        return

    notebooks = await integration.list_notebooks()
    if not notebooks:
        return

    notebook_id = None
    for nb in notebooks:
        if nb.title:
            notebook_id = nb.id
            break

    if not notebook_id:
        return

    success = integration.full_workflow(
        notebook_id=notebook_id,
        slidedeck_title="My Learning Content",
        platform_url="https://your-learning-platform.com/api",
        api_key="your-api-key-here",
        lesson_id="lesson-123"
    )

    if success:
        print("[SUCCESS] Slide deck created and uploaded!")


if __name__ == "__main__":
    print("NotebookLM + Claude Integration Examples")
    print("=" * 50)
    print("\nExample 1: Create and export slide deck as PDF")
    asyncio.run(example_create_and_export_slidedeck())
