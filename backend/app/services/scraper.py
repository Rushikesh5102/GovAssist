import os
from bs4 import BeautifulSoup
import requests
from app.core.database import SessionLocal
from app.models.scheme import Scheme

def scrape_schemes():
    from app.core.config import settings
    if not settings.ENABLE_SCRAPER:
        print("Scraper is disabled. Skipping run.")
        return

    print("Starting automated scraper run...")
    try:
        # Pulling live data from Wikipedia's comprehensive list of Government Schemes in India
        url = "https://en.wikipedia.org/wiki/List_of_government_schemes_in_India"
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        tables = soup.find_all('table', class_='wikitable')
        
        db = SessionLocal()
        import json
        
        added_count = 0
        if tables:
            # First table contains the bulk of the active schemes
            for row in tables[0].find_all('tr')[1:]: # Skip header
                cols = row.find_all(['th', 'td'])
                if len(cols) >= 4:
                    name = cols[0].text.strip()
                    type_str = cols[1].text.strip() # CSS or CS
                    ministry = cols[2].text.strip()
                    desc = cols[3].text.strip()
                    
                    if len(name) < 3 or len(desc) < 5:
                        continue
                        
                    existing = db.query(Scheme).filter(Scheme.name == name).first()
                    if not existing:
                        new_scheme = Scheme(
                            name=name,
                            description=desc,
                            category="General Welfare",
                            ministry=ministry,
                            active=True,
                            eligibility_criteria=json.dumps({"general": "Refer to official portal"}),
                            benefits=json.dumps({"summary": f"Scheme type: {type_str}"}),
                            tags=f"Wikipedia,{ministry}"
                        )
                        db.add(new_scheme)
                        added_count += 1
            
            db.commit()
            print(f"Scraper successfully added {added_count} new schemes to database from Wikipedia.")
        else:
            print("Scraper ran but found no tables on the target URL.")
    except Exception as e:
        print(f"Scraper encountered an error: {e}")
    finally:
        db.close()

def init_scheduler():
    from apscheduler.schedulers.background import BackgroundScheduler
    scheduler = BackgroundScheduler()
    # Run every 24 hours
    scheduler.add_job(scrape_schemes, 'interval', hours=24)
    scheduler.start()
    print("Background scraper scheduler started.")
