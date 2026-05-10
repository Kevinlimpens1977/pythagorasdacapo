#!/usr/bin/env python3
"""
Convert the HTML slidedeck to PDF using weasyprint
"""

from pathlib import Path

try:
    from weasyprint import HTML, CSS
    has_weasyprint = True
except ImportError:
    has_weasyprint = False
    print("[INFO] weasyprint not installed, trying alternative...")

def create_pdf_from_html():
    """Convert HTML to PDF"""

    html_file = Path("exports/7-3-langste-zijde_slidedeck.html")
    pdf_file = Path("boekafbeeldingen/7.3-slidedeck.pdf")

    if not html_file.exists():
        print(f"[ERROR] HTML file not found: {html_file}")
        return False

    print(f"[INFO] Converting HTML to PDF...")
    print(f"  Input: {html_file}")
    print(f"  Output: {pdf_file}")

    try:
        if has_weasyprint:
            # Use weasyprint
            print("  [INFO] Using weasyprint...")
            HTML(str(html_file)).write_pdf(str(pdf_file))

            if pdf_file.exists():
                size = pdf_file.stat().st_size / 1024 / 1024
                print(f"  [OK] PDF created: {size:.2f} MB")
                return True
        else:
            # Fallback: try using wkhtmltopdf if available
            print("  [INFO] Trying wkhtmltopdf...")
            import subprocess
            result = subprocess.run([
                "wkhtmltopdf",
                str(html_file),
                str(pdf_file)
            ], capture_output=True, timeout=60)

            if result.returncode == 0 and pdf_file.exists():
                size = pdf_file.stat().st_size / 1024 / 1024
                print(f"  [OK] PDF created: {size:.2f} MB")
                return True
            else:
                print(f"  [WARN] wkhtmltopdf failed")
                return False

    except ImportError:
        print("  [WARN] weasyprint not available")
        print("  [INFO] Install with: pip install weasyprint")
        return False
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False

if __name__ == "__main__":
    success = create_pdf_from_html()
    if not success:
        print("\n[INFO] PDF creation via weasyprint/wkhtmltopdf not available")
        print("[SOLUTION] Using the test-slidedeck HTML as-is")
        print("           You can open boekafbeeldingen/ and use the HTML directly")
        print("           Or print-to-PDF from browser (Ctrl+P)")
