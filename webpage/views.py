import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

def match_cv_response(user_message):
    message = user_message.lower().strip()
    
    # --- YOUR TRAINED CV KNOWLEDGE BASE ---
    if any(keyword in message for keyword in ["education", "study", "university", "degree", "graduated", "masters", "bachelor"]):
        return (
            "Anas holds a Master of Science in Information Systems from Uppsala University (Sweden, 2025) "
            "and a Bachelor of Science in Software Engineering from American International University - Bangladesh (AIUB, 2016)."
        )
        
    elif any(keyword in message for keyword in ["experience", "career", "work", "job", "sqa", "qa", "testing", "engineer", "senior"]):
        return (
            "Anas is a dedicated Software Quality Assurance (SQA) Engineer with comprehensive experience testing "
            "web and mobile applications in FinTech and platform development. He focuses on aligning complex specifications "
            "with flawless, production-ready execution. He recently applied for a Senior QA Engineer position at Brain Station 23."
        )
        
    elif any(keyword in message for keyword in ["skills", "automation", "framework", "selenium", "playwright", "postman", "python", "c#"]):
        return (
            "Anas's core technical skills include:\n"
            "• Web Automation: Selenium, \n"
            "• API Testing: Postman\n"
            "• Frameworks & Languages: Python (PyCharm ecosystem), C#\n"
            "• Capabilities: Mobile Application Testing, Information Systems Architecture."
        )
        
    elif any(keyword in message for keyword in ["research", "thesis", "digital nomad", "nomadism", "publication", "paper"]):
        return (
            "Anas completed a prominent academic Master's thesis at Uppsala University titled: "
            "\"Exploring the Transformation of Practices in the Transition to Digital Nomadism.\" "
            "The research analyzes the infrastructure and evolving practical paradigms of remote digital nomadic workspaces."
        )
        
    elif any(keyword in message for keyword in ["contact", "location", "live", "sweden", "dhaka", "email", "linkedin"]):
        return (
            "Anas is currently based in Uppsala, Sweden and Dhaka. "
            "You can contact him directly via email at anasmahdianonno@gmail.com, "
            "or connect on LinkedIn at linkedin.com/in/anasmahdi."
        )
        
    elif any(keyword in message for keyword in ["hello", "hi", "hey", "greetings"]):
        return "Hi there! I am Anas's AI Assistant. Ask me anything about his education, career, skills, or thesis research!"
        
    else:
        return (
            "I can absolutely share details about that! Could you specify if you are curious about "
            "Anas's SQA engineering experience, automation skills (Selenium/Playwright), "
            "Uppsala University education, or his digital nomadism thesis research?"
        )

@ensure_csrf_cookie
def chat_response_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            # Run the matching algorithm
            ai_reply = match_cv_response(user_message)
            
            return JsonResponse({'reply': ai_reply})
        except json.JSONDecodeError:
            return JsonResponse({'reply': 'Invalid data format received.'}, status=400)
            
    return JsonResponse({'reply': 'Only POST method is permitted.'}, status=405)


# --- CORE HOME ROUTE VIEW ---
def home(request):
    # This renders your portfolio page configuration layout
    return render(request, 'webpage/home.html')