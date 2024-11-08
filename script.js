// Get necessary DOM elements
const togglerButton = document.querySelector('.chatbot-toggler');
const body = document.body;
const sendBtn = document.querySelector('#send-btn');
const chatbox = document.querySelector('.chatbox');
const textarea = document.querySelector('textarea');

// Create loading indicator element
const loadingIndicator = document.createElement('li');
loadingIndicator.classList.add('chat', 'loading');
loadingIndicator.innerHTML = `<p>Loading...</p>`;

// Toggle chatbot UI
togglerButton.addEventListener('click', () => {
    body.classList.toggle('show-chatbot');
});

// Auto-scroll to the bottom of the chatbox
function autoScroll() {
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add user message
function addUserMessage(message) {
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat', 'outgoing');
    userMessage.innerHTML = `<p>${message}</p>`;
    chatbox.appendChild(userMessage);
    autoScroll();
}

// Add bot response
function addBotResponse(message) {
    const botMessage = document.createElement('li');
    botMessage.classList.add('chat', 'incoming');
    botMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatbox.appendChild(botMessage);
    autoScroll();
}

// Update the send button event listener
sendBtn.addEventListener('click', () => {
    const userMessage = textarea.value.trim();
    if (userMessage) {
        addUserMessage(userMessage);
        textarea.value = ''; // Clear the textarea

        // Add loading indicator to the chatbox
        chatbox.appendChild(loadingIndicator);
        autoScroll();

        // Send user message to the server
        fetch('http://localhost:3002/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading indicator
            chatbox.removeChild(loadingIndicator);

            // Add the bot's response to the chatbox
            if (data.response) {
                addBotResponse(data.response);
            } else {
                addBotResponse("I'm sorry, I couldn't understand that.");
            }
        })
        .catch(error => {
            // Remove loading indicator on error
            chatbox.removeChild(loadingIndicator);
            console.error('Error:', error);
            addBotResponse('Sorry, something went wrong. Please try again.');
        });
    } else {
        console.warn('Input is empty.'); // Log empty input
    }
});

// Automatically resize textarea based on content
textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});
