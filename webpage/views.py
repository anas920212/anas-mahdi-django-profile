import os
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are Anas Mahdi's AI assistant on his portfolio website.
Answer questions about Anas using ONLY the information below. Be friendly, concise, and professional.

- Education: MSc in Information Systems, Uppsala University, Sweden (2025); BSc in Software Engineering, AIUB, Bangladesh (2016)
- Role: Software Quality Assurance (SQA) Engineer, experienced in FinTech and platform testing
- Skills: Web Automation (Selenium, Playwright), API Testing (Postman), Python, C#, Mobile Application Testing, Information Systems Architecture
- Thesis: "Exploring the Transformation of Practices in the Transition to Digital Nomadism" (Uppsala University)
- Location: Uppsala, Sweden / Dhaka, Bangladesh
- Contact: anasmahdianonno@gmail.com, linkedin.com/in/anasmahdi

If asked something unrelated to Anas, politely redirect the conversation back to his background.
"""

@ensure_csrf_cookie
def chat_response_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_message,
                config={
                    "system_instruction": SYSTEM_PROMPT,
                    "max_output_tokens": 500,
                }
            )

            ai_reply = response.text

            return JsonResponse({'reply': ai_reply})

        except json.JSONDecodeError:
            return JsonResponse({'reply': 'Invalid data format received.'}, status=400)
        except Exception as e:
            return JsonResponse({'reply': f'Error: {str(e)}'}, status=500)

    return JsonResponse({'reply': 'Only POST method is permitted.'}, status=405)


def home(request):
    return render(request, 'webpage/home.html')

def index(request):
    return render(request, 'webpage/index.html')

def about(request):
    return render(request, 'webpage/about.html')

from django.core.mail import send_mail
from django.conf import settings

def contact_form_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', '')
            email = data.get('email', '')
            contact_number = data.get('contact_number', '')
            country = data.get('country', '')
            message = data.get('message', '')

            # আপাতত শুধু console-এ print করছি (email পাঠানোর সেটআপ পরে করব)
            print(f"""
            New Contact Form Submission:
            Name: {name}
            Email: {email}
            Contact: {contact_number}
            Country: {country}
            Message: {message}
            """)

            return JsonResponse({'success': True})

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Only POST allowed'}, status=405)