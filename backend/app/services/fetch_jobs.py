import httpx
from sqlalchemy.orm import Session
from app.models.job import Job
from dotenv import load_dotenv
from app.models.alert import AlertFilter
from app.models.user import User
import os
import asyncio

load_dotenv()

REMOTIVE_URL = "https://remotive.com/api/remote-jobs"
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"

def fetch_remotive_jobs(db: Session):
    try:
        response = httpx.get(REMOTIVE_URL, timeout=30)
        data = response.json()
        jobs = data.get("jobs", [])
        new_count = 0

        for job in jobs:
            existing = db.query(Job).filter(
                Job.remotive_id == job["id"]
            ).first()

            if existing:
                continue

            new_job = Job(
                remotive_id=job["id"],
                title=job["title"],
                company=job["company_name"],
                location=job.get("candidate_required_location", "Remote"),
                salary=job.get("salary", None),
                job_type=job.get("job_type", None),
                source_url=job.get("url", None),
            )
            db.add(new_job)
            new_count += 1

        db.commit()
        print(f"Remotive: Fetched {len(jobs)} jobs. Saved {new_count} new.")
        return new_count

    except Exception as e:
        print(f"Remotive error: {e}")
        db.rollback()
        return 0

def fetch_adzuna_jobs(db: Session):
    try:
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "results_per_page": 50,
            "what": "intern OR internship OR fresher",
            "content-type": "application/json",
        }

        response = httpx.get(ADZUNA_URL, params=params, timeout=30)
        data = response.json()
        jobs = data.get("results", [])
        new_count = 0

        for job in jobs:
            existing = db.query(Job).filter(
                Job.source_url == job.get("redirect_url")
            ).first()

            if existing:
                continue

            new_job = Job(
                remotive_id=None,
                title=job.get("title", "Untitled"),
                company=job.get("company", {}).get("display_name", "Unknown"),
                location=job.get("location", {}).get("display_name", "India"),
                salary=str(job.get("salary_min", "")) if job.get("salary_min") else None,
                job_type="full_time",
                source_url=job.get("redirect_url", None),
            )
            db.add(new_job)
            new_count += 1

        db.commit()
        print(f"Adzuna: Fetched {len(jobs)} jobs. Saved {new_count} new.")
        return new_count

    except Exception as e:
        print(f"Adzuna error: {e}")
        db.rollback()
        return 0

def fetch_and_save_jobs(db: Session):
    total = 0
    new_remotive = fetch_remotive_jobs(db)
    new_adzuna = fetch_adzuna_jobs(db)
    total = new_remotive + new_adzuna

    if total > 0:
        recent_jobs = db.query(Job).order_by(Job.created_at.desc()).limit(total).all()
        match_and_notify(recent_jobs, db)

    print(f"Total new jobs saved: {total}")
    return total


def match_and_notify(new_jobs: list, db: Session):
    if not new_jobs:
        return

    alerts = db.query(AlertFilter).all()

    for alert in alerts:
        matched = []
        for job in new_jobs:
            keyword_match = True
            location_match = True

            if alert.keywords:
                keywords = [k.strip().lower() for k in alert.keywords.split(",")]
                keyword_match = any(k in job.title.lower() for k in keywords)

            if alert.location:
                location_match = alert.location.lower() in (job.location or "").lower()

            if keyword_match and location_match:
                matched.append(job)

        if matched:
            user = db.query(User).filter(User.id == alert.user_id).first()
            if user:
                try:
                    from app.services.email import send_alert_email
                    asyncio.run(send_alert_email(user.email, matched))
                    print(f"Alert email sent to {user.email} with {len(matched)} jobs")
                except Exception as e:
                    print(f"Email error: {e}")