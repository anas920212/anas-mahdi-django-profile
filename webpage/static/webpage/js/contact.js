document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('contact-status-msg');

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

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                contact_number: document.getElementById('contact_number').value,
                country: document.getElementById('country').value,
                message: document.getElementById('message').value,
            };

            statusMsg.textContent = 'Sending...';

            fetch('/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    statusMsg.textContent = 'Message sent successfully!';
                    form.reset();
                } else {
                    statusMsg.textContent = 'Something went wrong. Please try again.';
                }
            })
            .catch(error => {
                statusMsg.textContent = 'Network error. Please try again later.';
                console.error('Contact form error:', error);
            });
        });
    }
});