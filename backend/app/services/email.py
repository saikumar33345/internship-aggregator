import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")


async def send_alert_email(email: str, jobs: list):
    jobs_html = ""

    for job in jobs:
        jobs_html += f"""
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;">
            <h3>{job.title}</h3>
            <p>{job.company}</p>

            {f'<p>📍 {job.location}</p>' if job.location else ''}

            {f'<p>💰 {job.salary}</p>' if job.salary else ''}

            {f'<a href="{job.source_url}">Apply Now →</a>' if job.source_url else ''}
        </div>
        """

    html = f"""
    <div style="font-family:Arial,sans-serif;">
        <h1>InternHub</h1>

        <p>
            We found {len(jobs)} matching internship(s).
        </p>

        {jobs_html}
    </div>
    """

    result = resend.Emails.send(
        {
            "from": "InternHub <onboarding@resend.dev>",
            "to": email,
            "subject": f"{len(jobs)} New Matching Internship(s)",
            "html": html,
        }
    )

    print("RESEND RESULT:", result)