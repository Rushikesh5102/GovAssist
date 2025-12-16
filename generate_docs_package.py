import os
import markdown
from xhtml2pdf import pisa
import zipfile

DOCS_DIR = "docs/complete-suite"
OUTPUT_ZIP = "docs/complete-suite.zip"

def convert_md_to_pdf(md_file, pdf_file):
    with open(md_file, "r", encoding="utf-8") as f:
        text = f.read()
    
    # Convert MD to HTML
    html_content = markdown.markdown(text, extensions=['tables', 'fenced_code'])
    
    # Add some basic styling
    styled_html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Helvetica, sans-serif; font-size: 12pt; }}
            h1 {{ color: #2c3e50; border-bottom: 2px solid #e67e22; padding-bottom: 10px; }}
            h2 {{ color: #34495e; margin-top: 20px; }}
            code {{ background-color: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-family: monospace; }}
            pre {{ background-color: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Convert HTML to PDF
    with open(pdf_file, "wb") as f:
        pisa_status = pisa.CreatePDF(styled_html, dest=f)
    
    if pisa_status.err:
        print(f"Error converting {md_file}")
    else:
        print(f"Created {pdf_file}")

def create_zip_archive():
    with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DOCS_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(DOCS_DIR))
                zipf.write(file_path, arcname)
    print(f"Created archive {OUTPUT_ZIP}")

def main():
    if not os.path.exists(DOCS_DIR):
        print(f"Directory {DOCS_DIR} not found.")
        return

    for filename in os.listdir(DOCS_DIR):
        if filename.endswith(".md"):
            md_path = os.path.join(DOCS_DIR, filename)
            pdf_path = os.path.join(DOCS_DIR, filename.replace(".md", ".pdf"))
            convert_md_to_pdf(md_path, pdf_path)
            
    create_zip_archive()

if __name__ == "__main__":
    main()
