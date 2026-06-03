from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.services.fetch_jobs import fetch_and_save_jobs

scheduler=BackgroundScheduler()

def scheduled_fetch():
    db=SessionLocal()
    try:
        print("Scheduler:Fetching Jobs...")
        count=fetch_and_save_jobs(db)
        print(f"Scheduler:done . {count} Jobs Fetched")
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(scheduled_fetch,"interval",hours=6)
    scheduler.start()
    print("Scheduler started.Jobs will be fetched every 6 Hours") 