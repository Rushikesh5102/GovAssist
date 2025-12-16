import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.scheme_update import SchemeUpdate

class CrawlerService:
    @staticmethod
    def run_mock_crawl(db: Session):
        # Simulate discovering new schemes
        new_schemes = [
            {
                "title": "PM Vishwakarma Yojana",
                "description": "Support for traditional artisans and craftspeople.",
                "ministry": "Ministry of MSME",
                "url": "https://pmvishwakarma.gov.in"
            },
            {
                "title": "Lakhpati Didi",
                "description": "Skill development training for women in self-help groups.",
                "ministry": "Ministry of Rural Development",
                "url": "https://lakhpatididi.gov.in"
            }
        ]
        
        count = 0
        for scheme in new_schemes:
            # Check if already exists in updates
            exists = db.query(SchemeUpdate).filter(SchemeUpdate.title == scheme["title"]).first()
            if not exists:
                update = SchemeUpdate(
                    title=scheme["title"],
                    description=scheme["description"],
                    ministry=scheme["ministry"],
                    url=scheme["url"],
                    source="Mock Crawler",
                    status="pending"
                )
                db.add(update)
                count += 1
        
        db.commit()
        return count
