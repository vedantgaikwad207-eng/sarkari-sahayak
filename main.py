import os
import sys
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("SARVAM_API_KEY")
if not api_key:
    sys.exit("Error: SARVAM_API_KEY is not set. Please add your key to .env.")

from sarvamai import SarvamAI

client = SarvamAI(api_subscription_key=api_key)

response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[
        {"role": "user", "content": "Hello! Please give a brief one-sentence greeting."}
    ],
)

print(response.choices[0].message.content)
