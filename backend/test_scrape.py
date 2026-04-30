import requests
from bs4 import BeautifulSoup
import json

def test_scrape_wiki():
    url = "https://en.wikipedia.org/wiki/List_of_government_schemes_in_India"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        tables = soup.find_all('table', class_='wikitable')
        print(f"Found {len(tables)} tables.")
        
        schemes = []
        if tables:
            for row in tables[0].find_all('tr')[1:6]: # first 5 rows
                cols = row.find_all(['th', 'td'])
                if len(cols) >= 3:
                    name = cols[0].text.strip()
                    ministry = cols[1].text.strip()
                    desc = cols[2].text.strip()
                    schemes.append({"name": name, "ministry": ministry, "description": desc})
        
        print(json.dumps(schemes, indent=2))
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_scrape_wiki()
