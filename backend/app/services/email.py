from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_USERNAME"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_alert_email(email: str, jobs: list):
    jobs_html = ""

    for job in jobs:
        jobs_html += f"""
        <div style="border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-bottom:12px;">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            {f'<a href="{job.source_url}">Apply</a>' if job.source_url else ''}
        </div>
        """

    html = f"""
    <h2>InternHub Alerts</h2>
    <p>Found {len(jobs)} matching jobs.</p>
    {jobs_html}
    """

    message = MessageSchema(
        subject=f"🚀 {len(jobs)} New Internship(s)",
        recipients=[email],
        body=html,
        subtype="html",
    )

    fm = FastMail(conf)
    await fm.send_message(message)