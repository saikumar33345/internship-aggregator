import httpx
from sqlalchemy.orm import Session
from app.models.job import Job

REMOTIVE_URL = "https://remotive.com/api/remote-jobs"

def fetch_and_save_jobs(db: Session):
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
        print(f"Fetched {len(jobs)} jobs. Saved {new_count} new jobs.")
        return new_count

    except Exception as e:
        print(f"Error fetching jobs: {e}")
        db.rollback()
        return 0