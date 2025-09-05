import os
from openai import OpenAI


def request_openai_api(prompt: str, system_prompt: str, model="gpt-5") -> str:
    """Request content generation from OpenAI API"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    if not client.api_key:
        raise ValueError("OpenAI API key is required")

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=1,
            max_completion_tokens=10000,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        raise RuntimeError(f"Failed to generate content: {str(e)}")

