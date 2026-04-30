import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from app.models.scheme_update import SchemeUpdate
import logging

class CrawlerService:
    @staticmethod
    def run_real_crawl(db: Session):
        """Scrapes real government schemes from india.gov.in"""
        url = "https://www.india.gov.in/my-government/schemes"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            schemes = []
            # Scrape scheme titles and links from the list
            for item in soup.select('.view-content .views-row'):
                title_elem = item.select_one('a')
                if title_elem:
                    title = title_elem.text.strip()
                    link = title_elem.get('href', '')
                    if link.startswith('/'):
                        link = "https://www.india.gov.in" + link
                    
                    schemes.append({
                        "title": title,
                        "description": f"Details available at: {link}",
                        "ministry": "Government of India",
                        "url": link
                    })
            
            count = 0
            for scheme in schemes:
                exists = db.query(SchemeUpdate).filter(SchemeUpdate.title == scheme["title"]).first()
                if not exists:
                    update = SchemeUpdate(
                        title=scheme["title"],
                        description=scheme["description"],
                        ministry=scheme["ministry"],
                        url=scheme["url"],
                        source="India.gov.in Scraper",
                        status="pending"
                    )
                    db.add(update)
                    count += 1
            
            db.commit()
            return count
            
        except Exception as e:
            logging.error(f"Crawler error: {e}")
            return 0
