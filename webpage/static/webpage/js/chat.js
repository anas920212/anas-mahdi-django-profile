document.addEventListener('DOMContentLoaded', function () {
    const chatLauncher = document.getElementById('chat-launcher');
    const chatContainer = document.getElementById('chat-container');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatLog = document.getElementById('chat-log');

    // Toggle chat open/close via launcher
    if (chatLauncher && chatContainer) {
        chatLauncher.addEventListener('click', function () {
            chatContainer.classList.toggle('active');
        });
    }

    if (chatCloseBtn && chatContainer) {
        chatCloseBtn.addEventListener('click', function () {
            chatContainer.classList.remove('active');
        });
    }

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
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        const userMessageHtml = `
            <div style="background: #1e3a8a; color: #ffffff; padding: 12px 16px; border-radius: 14px 14px 0 14px; font-size: 0.9rem; align-self: flex-end; max-width: 80%; margin-top: 8px;">
                ${messageText}
            </div>
        `;
        chatLog.insertAdjacentHTML('beforeend', userMessageHtml);
        chatInput.value = '';
        chatLog.scrollTop = chatLog.scrollHeight;

        const typingId = 'typing-' + Date.now();
        const typingHtml = `
            <div id="${typingId}" style="background: #e2e8f0; color: #64748b; padding: 12px 16px; border-radius: 14px 14px 14px 0; font-size: 0.9rem; align-self: flex-start; max-width: 80%; margin-top: 8px; font-style: italic;">
                Thinking...
            </div>
        `;
        chatLog.insertAdjacentHTML('beforeend', typingHtml);
        chatLog.scrollTop = chatLog.scrollHeight;

        fetch('/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ message: messageText })
        })
        .then(response => response.json())
        .then(data => {
            const typingElem = document.getElementById(typingId);
            if (typingElem) typingElem.remove();

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