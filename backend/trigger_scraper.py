import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.scraper import scrape_schemes

if __name__ == "__main__":
    scrape_schemes()
