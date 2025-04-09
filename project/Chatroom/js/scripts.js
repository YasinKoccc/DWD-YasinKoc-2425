// DOM Elements
const form = document.querySelector('.comment-form');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');
const chatArea = document.querySelector('.chat-area');

// API Configuration
const gravatarBaseUrl = 'https://www.gravatar.com/avatar/';
const giphyApiKey = 'W1cctClRVfFubkFgtfzQvwX2WblD1hpY'; // Replace with your key

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadChatFromLocalStorage();
    loadFormFromLocalStorage();
    
    // Set up event listeners
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('input', saveFormState);
    chatArea.addEventListener('dblclick', handleDoubleClick);
});
// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();

    if (!validateForm(email, comment)) return;

    addTextMessage(email, comment);
    saveChatToLocalStorage();
    clearForm();
}

function createMessage(email, content, isGif = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    const gravatarUrl = `${gravatarBaseUrl}${md5(email.toLowerCase())}?d=retro&s=50`;

    messageDiv.innerHTML = `
        <div class="profile-container">
            <img src="${gravatarUrl}"
                 class="profile-pic"
                 alt="Profile">
            <span class="email-tooltip">${email}</span>
        </div>
        <div class="message-content">
            <span class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            ${isGif ?
                `<img src="${content}" class="gif-message" alt="GIF">` :
                `<p class="message-text">${content}</p>`
            }
        </div>
    `;

    return messageDiv;
}
function addTextMessage(email, comment) {
    chatArea.appendChild(createMessage(email, comment));
    scrollToBottom();
}

// GIF handling functions
function handleDoubleClick(e) {
    if (e.target.classList.contains('message-text')) {
        const selection = window.getSelection().toString().trim();
        if (selection) fetchGifs(selection);
    }
}

async function fetchGifs(query) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${query}&limit=5`);
        const data = await response.json();
        showGifModal(data.data);
    } catch (error) {
        console.error('Giphy API error:', error);
        alert('Failed to load GIFs. Please try again.');
    }
}

function showGifModal(gifs) {
    const modal = document.createElement('div');
    modal.className = 'gif-modal';

    modal.innerHTML = `
        <div class="modal-content">
            <h3>Select a GIF</h3>
            <div class="gif-grid">
                ${gifs.map(gif => `
                    <img src="${gif.images.fixed_height.url}"
                         class="gif-option"
                         data-url="${gif.images.original.url}"
                         alt="${gif.title}">
                `).join('')}
            </div>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('gif-option')) {
            addGifToChat(e.target.dataset.url);
        }
        modal.remove();
    });

    document.body.appendChild(modal);
}

function addGifToChat(gifUrl) {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        alert('Please enter your email before sending GIFs');
        return;
    }

    chatArea.appendChild(createMessage(email, gifUrl, true));
    saveChatToLocalStorage();
    scrollToBottom();
}

// LocalStorage functions
function saveChatToLocalStorage() {
    const messages = Array.from(chatArea.children).map(el => el.outerHTML);
    localStorage.setItem('chatContent', JSON.stringify(messages));
}

function loadChatFromLocalStorage() {
    const messages = JSON.parse(localStorage.getItem('chatContent')) || [];
    chatArea.innerHTML = messages.join('');
}

function saveFormState() {
    localStorage.setItem('formData', JSON.stringify({
        email: emailInput.value,
        comment: commentInput.value
    }));
}

function loadFormFromLocalStorage() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        emailInput.value = formData.email || '';
        commentInput.value = formData.comment || '';
    }
}

// Utility functions
function validateForm(email, comment) {
    const errors = [];

    if (!validateEmail(email)) {
        emailInput.classList.add('invalid');
        errors.push('Please enter a valid email address');
    } else {
        emailInput.classList.remove('invalid');
    }

    if (!comment.trim()) {
        commentInput.classList.add('invalid');
        errors.push('Comment cannot be empty');
    } else {
        commentInput.classList.remove('invalid');
    }

    if (errors.length) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearForm() {
    form.reset();
    localStorage.removeItem('formData');
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

function md5(string) {
    return CryptoJS.MD5(string).toString();
}