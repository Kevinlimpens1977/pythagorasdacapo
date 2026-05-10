#!/usr/bin/env python3
"""
NotebookLM CLI Tool - Create slidedecks from Claude Code
Usage: python notebooklm_cli.py create-slidedeck <notebook-name-or-id> [description]
"""

import asyncio
import sys
import argparse
from pathlib import Path
from notebooklm_integration import NotebookLMIntegration

def find_notebook(notebooks, query: str):
    """Find notebook by name or ID"""
    query_lower = query.lower()

    # Exact ID match
    for nb in notebooks:
        if nb.id == query:
            return nb

    # Partial match in title
    for nb in notebooks:
        if nb.title and query_lower in nb.title.lower():
            return nb

    return None

async def create_slidedeck(notebook_query: str, description: str = None):
    """Create a slide deck from a notebook"""

    integration = NotebookLMIntegration()

    if not await integration.authenticate():
        print("[ERROR] Authentication failed. Run: python -m notebooklm login")
        return False

    # Get notebooks
    notebooks = await integration.list_notebooks()
    if not notebooks:
        print("[ERROR] No notebooks found")
        return False

    # Find notebook
    notebook = find_notebook(notebooks, notebook_query)
    if not notebook:
        print(f"[ERROR] Notebook '{notebook_query}' not found")
        print(f"[INFO] Available notebooks (first 10):")
        for nb in notebooks[:10]:
            if nb.title:
                print(f"  - {nb.title} (ID: {nb.id})")
        return False

    print(f"[INFO] Found notebook: {notebook.title}")

    # Create slide deck
    description = description or "Generate comprehensive slide deck with key concepts and examples"
    artifact_id = integration.create_slidedeck(
        notebook_id=notebook.id,
        description=description,
        format="detailed",
        length="default",
        wait=True
    )

    if not artifact_id:
        return False

    # Export as PDF
    pdf_path = integration.export_artifact_as_pdf(
        notebook_id=notebook.id,
        artifact_id=artifact_id,
        output_path=Path("./exports")
    )

    if pdf_path:
        print(f"\n[SUCCESS] Slide deck created at: {pdf_path}")
        print(f"[INFO] You can now upload this to your learning platform")
        return True

    return False

def main():
    parser = argparse.ArgumentParser(description="NotebookLM CLI Tool")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # create-slidedeck command
    create_parser = subparsers.add_parser("create-slidedeck", help="Create a slide deck from a notebook")
    create_parser.add_argument("notebook", help="Notebook name or ID")
    create_parser.add_argument("description", nargs="?", default=None, help="Description for slide deck generation")

    # list command
    list_parser = subparsers.add_parser("list", help="List all notebooks")

    args = parser.parse_args()

    if args.command == "create-slidedeck":
        success = asyncio.run(create_slidedeck(args.notebook, args.description))
        sys.exit(0 if success else 1)

    elif args.command == "list":
        async def list_notebooks():
            integration = NotebookLMIntegration()
            if not await integration.authenticate():
                print("[ERROR] Authentication failed")
                return
            await integration.list_notebooks()

        asyncio.run(list_notebooks())

    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
