import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

async def send_alert_email(email: str, jobs: list):

    html = f"""
    <h1>InternHub Test Email</h1>
    <p>Found {len(jobs)} matching jobs.</p>
    """

    result = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": email,
        "subject": "InternHub Test",
        "html": html,
    })

    print("RESEND RESULT:", result)