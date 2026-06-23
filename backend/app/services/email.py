from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_USERNAME"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp-relay.brevo.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_alert_email(email: str, jobs: list):
    jobs_html = ""

    for job in jobs:
        jobs_html += f"""
        <div style="border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-bottom:12px;">
            <h3 style="color:#1f2937; margin:0 0 4px 0;">{job.title}</h3>

            <p style="color:#6b7280; margin:0 0 8px 0;">
                {job.company}
            </p>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">

                {f'<span style="background:#f3f4f6; padding:4px 10px; border-radius:20px; font-size:12px;">📍 {job.location}</span>' if job.location else ''}

                {f'<span style="background:#f3f4f6; padding:4px 10px; border-radius:20px; font-size:12px;">💰 {job.salary}</span>' if job.salary else ''}

            </div>

            {f'<a href="{job.source_url}" style="display:inline-block; margin-top:10px; background:#6366f1; color:white; padding:6px 14px; border-radius:8px; text-decoration:none; font-size:13px;">Apply →</a>' if job.source_url else ''}

        </div>
        """

    html = f"""
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px;">

        <div style="background:#000; padding:20px; border-radius:12px; margin-bottom:24px; text-align:center;">
            <h1 style="color:white; margin:0;">
                InternHub
            </h1>

            <p style="color:#9ca3af; margin-top:8px;">
                New matching internships found
            </p>
        </div>

        <p>
            Hey! We found
            <strong>{len(jobs)} new internship(s)</strong>
            matching your alert filters.
        </p>

        {jobs_html}

        <div style="margin-top:24px; padding:16px; background:#f9fafb; border-radius:12px; text-align:center;">
            <a
                href="https://internship-aggregator-brown.vercel.app/jobs"
                style="color:#6366f1; text-decoration:none;"
            >
                View all jobs on InternHub →
            </a>
        </div>

        <p style="color:#9ca3af; font-size:12px; text-align:center; margin-top:16px;">
            You're receiving this because you created a job alert on InternHub.
        </p>

    </div>
    """

    message = MessageSchema(
        subject=f"🚀 {len(jobs)} New Internship(s) Match Your Alerts!",
        recipients=[email],
        body=html,
        subtype="html",
    )

    try:
        print(f"Sending email to {email}")

        fm = FastMail(conf)
        await fm.send_message(message)

        print(f"Email sent successfully to {email}")

    except Exception as e:
        print(f"Email send failed for {email}: {e}")
        raise