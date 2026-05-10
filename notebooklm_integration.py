#!/usr/bin/env python3
"""
Claude + NotebookLM Integration Module
Handles creating slidedecks, exporting PDFs, and syncing with your learning platform
"""

import asyncio
import subprocess
import json
import time
from pathlib import Path
from typing import Optional
from notebooklm.client import NotebookLMClient
from notebooklm.auth import AuthTokens
import httpx

class NotebookLMIntegration:
    """Unified interface for Claude + NotebookLM + Learning Platform"""

    def __init__(self, storage_path: Optional[Path] = None):
        """Initialize with stored auth tokens"""
        self.storage_path = storage_path or (
            Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
        )
        self.auth_tokens = None

    async def authenticate(self) -> bool:
        """Load stored authentication tokens"""
        try:
            self.auth_tokens = await AuthTokens.from_storage(self.storage_path)
            print("[OK] Authenticated with NotebookLM")
            return True
        except Exception as e:
            print(f"[ERROR] Authentication failed: {e}")
            print(f"[INFO] Make sure you've run: python -m notebooklm login")
            return False

    async def list_notebooks(self):
        """List all available notebooks"""
        if not self.auth_tokens:
            print("[ERROR] Not authenticated")
            return []

        try:
            async with NotebookLMClient(self.auth_tokens) as client:
                notebooks = await client.notebooks.list()
                print(f"[OK] Found {len(notebooks)} notebooks")
                for nb in notebooks:
                    if nb.title:  # Skip empty titles
                        print(f"  - {nb.title} (ID: {nb.id})")
                return notebooks
        except Exception as e:
            print(f"[ERROR] Failed to list notebooks: {e}")
            return []

    def create_slidedeck(
        self,
        notebook_id: str,
        description: str = "Generate slide deck",
        format: str = "detailed",
        length: str = "default",
        wait: bool = True
    ) -> Optional[str]:
        """
        Create a slide deck from a notebook via CLI

        Args:
            notebook_id: ID of the notebook
            description: Description/prompt for the slide deck
            format: "detailed" or "presenter"
            length: "default" or "short"
            wait: Whether to wait for completion

        Returns:
            Artifact ID of the generated slide deck
        """
        try:
            print(f"[INFO] Creating slide deck from notebook: {notebook_id}")
            cmd = [
                "python", "-m", "notebooklm", "generate", "slide-deck",
                description,
                "-n", notebook_id,
                "--format", format,
                "--length", length,
                "--json"
            ]

            if wait:
                cmd.append("--wait")

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)

            if result.returncode != 0:
                print(f"[ERROR] Failed to create slide deck: {result.stderr}")
                return None

            # Parse JSON output
            output = json.loads(result.stdout)
            if "artifact_id" in output or "id" in output:
                artifact_id = output.get("artifact_id") or output.get("id")
                print(f"[OK] Slide deck created: {artifact_id}")
                return artifact_id
            else:
                print(f"[WARNING] Unexpected output: {output}")
                return None

        except Exception as e:
            print(f"[ERROR] Failed to create slide deck: {e}")
            return None

    def export_artifact_as_pdf(
        self,
        notebook_id: str,
        artifact_id: str,
        output_path: Optional[Path] = None
    ) -> Optional[Path]:
        """
        Export an artifact (slide deck) as PDF via CLI

        Args:
            notebook_id: ID of the notebook
            artifact_id: ID of the artifact
            output_path: Where to save the PDF (default: ./exports/)

        Returns:
            Path to the saved PDF
        """
        try:
            output_path = output_path or Path("./exports")
            output_path.mkdir(parents=True, exist_ok=True)

            print(f"[INFO] Exporting artifact as PDF...")
            cmd = [
                "python", "-m", "notebooklm", "download", "slide-deck",
                artifact_id,
                "-n", notebook_id
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

            if result.returncode != 0:
                print(f"[ERROR] Failed to export PDF: {result.stderr}")
                return None

            pdf_path = output_path / f"{artifact_id}.pdf"
            print(f"[OK] PDF exported to: {pdf_path}")
            return pdf_path

        except Exception as e:
            print(f"[ERROR] Failed to export PDF: {e}")
            return None

    async def upload_to_learning_platform(
        self,
        pdf_path: Path,
        platform_url: str,
        api_key: Optional[str] = None,
        lesson_id: Optional[str] = None
    ) -> bool:
        """
        Upload PDF to your learning platform

        Args:
            pdf_path: Path to the PDF file
            platform_url: Base URL of your learning platform API
            api_key: API key for authentication
            lesson_id: Target lesson ID in the platform

        Returns:
            True if successful
        """
        if not pdf_path.exists():
            print(f"[ERROR] PDF file not found: {pdf_path}")
            return False

        try:
            print(f"[INFO] Uploading PDF to learning platform...")

            pdf_content = pdf_path.read_bytes()

            files = {"file": ("slidedeck.pdf", pdf_content, "application/pdf")}
            data = {"lesson_id": lesson_id} if lesson_id else {}

            headers = {}
            if api_key:
                headers["Authorization"] = f"Bearer {api_key}"

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{platform_url}/upload",
                    files=files,
                    data=data,
                    headers=headers,
                    timeout=30.0
                )

                if response.status_code in [200, 201]:
                    print(f"[OK] PDF uploaded successfully")
                    return True
                else:
                    print(f"[ERROR] Upload failed: {response.status_code} - {response.text}")
                    return False

        except Exception as e:
            print(f"[ERROR] Failed to upload PDF: {e}")
            return False

    def full_workflow(
        self,
        notebook_id: str,
        slidedeck_title: str,
        platform_url: Optional[str] = None,
        api_key: Optional[str] = None,
        lesson_id: Optional[str] = None
    ) -> bool:
        """
        Complete workflow: Create slidedeck -> Export as PDF -> Upload to platform

        Returns:
            True if all steps successful
        """
        print("[INFO] Starting NotebookLM integration workflow...")

        artifact_id = self.create_slidedeck(notebook_id, slidedeck_title)
        if not artifact_id:
            return False

        pdf_path = self.export_artifact_as_pdf(notebook_id, artifact_id)
        if not pdf_path:
            return False

        if platform_url:
            return asyncio.run(self.upload_to_learning_platform(
                pdf_path, platform_url, api_key, lesson_id
            ))
        else:
            print(f"[INFO] PDF ready at: {pdf_path}")
            print("[INFO] To upload to your platform, provide platform_url and api_key")
            return True


async def main():
    """Demo usage"""
    integration = NotebookLMIntegration()

    if not await integration.authenticate():
        return

    await integration.list_notebooks()


if __name__ == "__main__":
    asyncio.run(main())
