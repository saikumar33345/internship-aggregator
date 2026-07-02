import os
import random
import resend

resend.api_key = os.getenv("RESEND_API_KEY")


def generate_otp():
    return str(random.randint(100000, 999999))


async def send_password_reset_otp(
    email: str,
    otp: str,
):
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;">
        <h2>InternHub Password Reset</h2>

        <p>
            We received a request to reset your password.
        </p>

        <p>Your verification code is:</p>

        <div
            style="
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                margin:20px 0;
            "
        >
            {otp}
        </div>

        <p>
            This code expires in <b>10 minutes</b>.
        </p>

        <p>
            If you didn't request a password reset,
            you can safely ignore this email.
        </p>
    </div>
    """

    resend.Emails.send(
        {
            "from": "InternHub <onboarding@resend.dev>",
            "to": email,
            "subject": "Reset your InternHub password",
            "html": html,
        }
    )