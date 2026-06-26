#!/usr/bin/env python3
"""
Digital People — Gerador de PDFs de Propostas
Usa Playwright para converter os templates HTML em PDFs de alta qualidade.

Uso:
  python3 gerar-pdf.py casamento
  python3 gerar-pdf.py debutante
  python3 gerar-pdf.py foto-lembranca
  python3 gerar-pdf.py todos
"""

import sys
import os
from pathlib import Path

def gerar_pdf(template: str):
    from playwright.sync_api import sync_playwright

    base = Path(__file__).parent
    html_path = base / template / "proposta.html"
    pdf_path = base / template / "proposta.pdf"

    if not html_path.exists():
        print(f"Erro: {html_path} não encontrado")
        return False

    file_url = f"file://{html_path.resolve()}"

    print(f"Gerando PDF: {template}...")
    print(f"  HTML: {html_path}")
    print(f"  PDF:  {pdf_path}")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate and wait for fonts + images
        page.goto(file_url, wait_until="networkidle")
        page.wait_for_timeout(2000)  # Extra time for Google Fonts

        page.pdf(
            path=str(pdf_path),
            format="A4",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            prefer_css_page_size=True,
        )

        browser.close()

    size_mb = pdf_path.stat().st_size / (1024 * 1024)
    print(f"  Pronto! {size_mb:.1f} MB")
    return True


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 gerar-pdf.py [casamento|debutante|foto-lembranca|todos]")
        sys.exit(1)

    arg = sys.argv[1].lower()

    templates = {
        "casamento": "casamento",
        "debutante": "debutante",
        "foto-lembranca": "foto-lembranca",
    }

    if arg == "todos":
        for name, folder in templates.items():
            gerar_pdf(folder)
    elif arg in templates:
        gerar_pdf(templates[arg])
    else:
        print(f"Template desconhecido: {arg}")
        print(f"Opções: {', '.join(templates.keys())}, todos")
        sys.exit(1)


if __name__ == "__main__":
    main()
