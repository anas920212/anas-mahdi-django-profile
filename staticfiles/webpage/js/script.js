// 1. Define the toggle function cleanly without stray brackets
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    // Check the current display style and flip it cleanly
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'flex'; 
    } else {
        chatContainer.style.display = 'none';
    }
}

// 2. Your message sending logic goes here once the DOM loads
document.addEventListener('DOMContentLoaded', function () {
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatLog = document.getElementById('chat-log');

    // Helper function to safely read the Django CSRF token cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    if (chatSend && chatInput && chatLog) {
        // Handle Send Button Click
        chatSend.addEventListener('click', function () {
            sendMessage();
        });

        // Handle Pressing 'Enter' Key
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // A. Append user message to chat log
        const userMessageHtml = `
            <div style="background: #1e3a8a; color: #ffffff; padding: 12px 16px; border-radius: 14px 14px 0 14px; font-size: 0.9rem; align-self: flex-end; max-width: 80%; margin-top: 8px;">
                ${messageText}
            </div>
        `;
        chatLog.insertAdjacentHTML('beforeend', userMessageHtml);
        
        // Clear input and auto-scroll down
        chatInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;

        // B. Add temporary status placeholder message
        const typingId = 'typing-' + Date.now();
        const typingHtml = `
            <div id="${typingId}" style="background: #e2e8f0; color: #64748b; padding: 12px 16px; border-radius: 14px 14px 14px 0; font-size: 0.9rem; align-self: flex-start; max-width: 80%; margin-top: 8px; font-style: italic;">
                Thinking...
            </div>
        `;
        chatLog.insertAdjacentHTML('beforeend', typingHtml);
        chatLog.scrollTop = chatLog.scrollHeight;

        // C. COMMUNICATION GATEWAY: Send data to Django view endpoint
        fetch('/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Protects against Django cross-site request forgery
            },
            body: JSON.stringify({ message: messageText })
        })
        .then(response => response.json())
        .then(data => {
            // Remove the "Thinking..." status placeholder
            const typingElem = document.getElementById(typingId);
            if (typingElem) typingElem.remove();

            // D. Append the actual AI bot response received from backend
            const botMessageHtml = `
                <div style="background: #e2e8f0; color: #0f172a; padding: 12px 16px; border-radius: 14px 14px 14px 0; font-size: 0.9rem; align-self: flex-start; max-width: 80%; margin-top: 8px;">
                    ${data.reply}
                </div>
            `;
            chatLog.insertAdjacentHTML('beforeend', botMessageHtml);
            chatLog.scrollTop = chatLog.scrollHeight;
        })
        .catch(error => {
            const typingElem = document.getElementById(typingId);
            if (typingElem) typingElem.remove();
            console.error('Network Error connecting to Chatbot API:', error);
        });
    }
});