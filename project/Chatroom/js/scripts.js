// DOM Elements
const form = document.querySelector('.comment-form');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');
const chatArea = document.querySelector('.chat-area');

// API Configuration
const gravatarBaseUrl = 'https://www.gravatar.com/avatar/';
const giphyApiKey = 'YOUR_GIPHY_API_KEY'; // Replace with your Giphy API key

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadChatFromLocalStorage();

    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    emailInput.addEventListener('input', handleEmailInput); // Separate email validation
    form.addEventListener('input', saveFormState);
    chatArea.addEventListener('dblclick', handleDoubleClick);
});
function loadChatFromLocalStorage() {
    // Haal berichten op uit LocalStorage
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || []; 

    if (!savedMessages.length) {
        console.log("Geen opgeslagen berichten gevonden.");
    }

    savedMessages.forEach(({ email, content, gif }) => {
        const message = gif 
            ? createMessage(email, gif, true) 
            : createMessage(email, content); // Maak bericht opnieuw aan
        chatArea.appendChild(message); // Voeg het toe aan de chatruimte
    });

    scrollToBottom(); // Zorg ervoor dat je automatisch naar de onderkant scrollt
}

function saveChatToLocalStorage() {
    const messages = [];

    // Verzamel alle berichten en sla ze op in LocalStorage
    document.querySelectorAll('.chat-message').forEach(message => {
        const email = message.querySelector('.email-tooltip').textContent;
        const content = message.querySelector('.message-text')?.textContent || '';
        const gif = message.querySelector('.gif-message')?.src || null;

        messages.push({ email, content, gif });
    });

    localStorage.setItem('chatMessages', JSON.stringify(messages)); // Sla de berichten op
    console.log("Berichten succesvol opgeslagen in LocalStorage.");
}

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

//Improved message creation
function createMessage(email, content, isGif = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    // Bereken de Gravatar URL
    const gravatarUrl = `${gravatarBaseUrl}${md5(email.toLowerCase())}?d=retro&s=50`;

    // Profielfoto en Tooltip
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('profile-container');

    const profilePic = document.createElement('img');
    profilePic.src = gravatarUrl;
    profilePic.alt = 'Profile Picture';

    // Randomly assign a shape class
    const shapeClass = Math.random() > 0.5 ? 'circle-shape' : 'square-shape';
    profilePic.classList.add('profile-pic', shapeClass);

    const emailTooltip = document.createElement('span');
    emailTooltip.classList.add('email-tooltip');
    emailTooltip.textContent = email;

    profileContainer.appendChild(profilePic);
    profileContainer.appendChild(emailTooltip);

    // Berichtinhoud
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    const messageText = isGif
        ? createGifElement(content)
        : createTextElement(content);

    messageContent.appendChild(messageText);

    // Samenvoegen
    messageDiv.appendChild(profileContainer);
    messageDiv.appendChild(messageContent);

    return messageDiv;
}

function createTextElement(content){
    const p = document.createElement('p');
    p.classList.add('message-text');
    p.textContent = content;
    return p;
}

function createGifElement(content){
    const img = document.createElement('img');
    img.src = content;
    img.alt = 'GIF';
    img.classList.add('gif-message');
    return img;
}

function addTextMessage(email, comment) {
    const message = createMessage(email, comment);
    chatArea.appendChild(message); // Append the created message element
    scrollToBottom();
}

// GIF handling functions
async function handleDoubleClick(e) {
    if (e.target.classList.contains('message-text')) {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            try {
                const gifs = await fetchGifs(selection);
                showGifModal(gifs);
            } catch (error) {
                handleError(error, 'Giphy API');
            }
        }
    }
}

async function fetchGifs(query) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${query}&limit=5`);
    if (!response.ok) {
        throw new Error(`Giphy API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.data;
}

function showGifModal(gifs) {
    // ... (modal code remains largely the same) ...
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

// LocalStorage functions (remain the same)

// Utility functions
function validateForm(email, comment) {
    let isValid = true;

    if (!validateEmail(email)) {
        emailInput.classList.add('invalid');
        isValid = false;
    } else {
        emailInput.classList.remove('invalid');
    }

    if (!comment.trim()) {
        commentInput.classList.add('invalid');
        isValid = false;
    } else {
        commentInput.classList.remove('invalid');
    }

    if (!isValid) {
        alert('Please correct the errors in the form.');
    }

    return isValid;
}

function validateEmail(email) {
    //Improved email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleEmailInput(){
    const email = emailInput.value.trim();
    if(validateEmail(email)){
        emailInput.classList.remove('invalid');
    } else {
        emailInput.classList.add('invalid');
    }
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

function handleError(error, apiName){
    console.error(`${apiName} API error:`, error);
    alert(`Failed to load from ${apiName} API. Please try again.`);
}
