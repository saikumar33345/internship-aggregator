import os
import json
import google.genai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-3.5-flash"
)


def generate_job_summary(description: str):

    if not description or len(description.strip()) < 20:
        return {
            "what_youll_do": [],
            "what_youll_need": [],
            "why_apply": []
        }

    prompt = f"""
You are an expert career advisor and hiring consultant.

Analyze the following internship/job description and extract the most important information for a student or job seeker.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- No code fences
- Keep points concise and practical
- Focus on actual responsibilities and requirements
- Ignore repetitive marketing language
- Generate 3 to 5 points per section

Required JSON format:

{{
  "what_youll_do": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "what_you_need": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "why_apply": [
    "point 1",
    "point 2",
    "point 3"
  ]
}}

Job Description:

{description}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        if text.startswith("```"):
            text = (
                text.replace("```", "")
                .strip()
            )

        return json.loads(text)

    except json.JSONDecodeError as e:
        print("JSON PARSE ERROR:", str(e))

        return {
            "what_youll_do": [
                "Unable to generate AI summary"
            ],
            "what_you_need": [
                "Please review the original job description"
            ],
            "why_apply": []
        }

    except Exception as e:
        print("GEMINI ERROR:", str(e))

        return {
            "what_youll_do": [
                "AI summary temporarily unavailable"
            ],
            "what_you_need": [
                "Please review the original job description"
            ],
            "why_apply": []
        }