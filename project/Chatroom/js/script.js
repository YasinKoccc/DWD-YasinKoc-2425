// Select elements using querySelector
const chatForm = document.querySelector('#chatForm');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');
const chatMessages = document.querySelector('#chatMessages');
const gifButton = document.querySelector('#gifButton');
const gifModal = document.querySelector('#gifModal');
const gifResults = document.querySelector('#gifResults');
const modalClose = document.querySelector('#modalClose');
const modalEmailInput = document.querySelector('#modalEmail');
const modalEmailError = document.querySelector('#modalEmailError');
const themeToggle = document.querySelector('#themeToggle');
const gifModalOverlay = document.querySelector('#gifModalOverlay');
const searchQueryDisplay = document.querySelector('#searchQueryDisplay');
const typingBar = document.querySelector('.typing-bar span');


// API key for Giphy
const API_KEY = 'W1cctClRVfFubkFgtfzQvwX2WblD1hpY';

// Helper Functions

// Show Modal
function showModal() {
    document.querySelector('#gifModalOverlay').style.display = 'flex';
    document.body.classList.add('modal-open');
}

// Hide Modal
function hideModal() {
    document.querySelector('#gifModalOverlay').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Toggle Modal
function toggleModal() {
    gifModal.classList.toggle('show');
}

// Validate email
function validateEmail(email) {
    return email.includes('@') && email.split('@')[1].includes('.');
}
// Set error message
function setError(inputElement, message) {
    const errorMessage = inputElement.nextElementSibling;
    errorMessage.textContent = message;
    inputElement.classList.add('error');
}

function clearError(inputElement) {
    const errorMessage = inputElement.nextElementSibling;
    errorMessage.textContent = '';
    inputElement.classList.remove('error');
}

// Sync email between form and modal
emailInput.addEventListener('input', () => {
    modalEmailInput.value = emailInput.value;
});

modalEmailInput.addEventListener('input', () => {
    emailInput.value = modalEmailInput.value;
});

// Add real-time validation for email input in the form
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) {
        clearError(emailInput);
    }
});

// Add real-time validation for comment input in the form
commentInput.addEventListener('input', () => {
    if (commentInput.value.trim()) {
        clearError(commentInput);
    }
});

// Add real-time validation for email input in the modal
modalEmailInput.addEventListener('input', () => {
    if (modalEmailInput.value.trim() && validateEmail(modalEmailInput.value.trim())) {
        clearError(modalEmailInput);
    }
});

// Functie om de username af te leiden uit het e-mailadres
function getUsernameFromEmail(email) {
    const username = email.split('@')[0]; // Haal alles voor de '@' uit het e-mailadres
    return username;
}


function handleGifSelection(gifUrl) {
    const email = modalEmailInput.value.trim();

    if (!email) {
        setError(modalEmailInput, 'Please enter your email address!');
        return;
    }

    if (!validateEmail(email)) {
        setError(modalEmailInput, 'Please enter a valid email address!');
        return;
    }

    clearError(modalEmailInput);

    const message = {
        email: email,
        comment: '',
        gravatarUrl: `https://www.gravatar.com/avatar/?d=retro`,
        gifUrl: gifUrl,
        shape: Math.random() < 0.5 ? 'circle' : 'square'
    };
    

    const messageHTML = `
        <div class="message">
            <img src="${message.gravatarUrl}" 
                 alt="Profile" 
                 class="${message.shape}" 
                 title="${message.email}">
            <div class="message-content">
                <img src="${gifUrl.replace('200.gif', 'giphy.gif')}" 
                     alt="GIF" 
                     class="chat-gif"
                     style="max-width: 300px; max-height: 300px;">
            </div>
            <span class="delete-button">🗑️</span>
        </div>
    `;

    addMessageToChat(messageHTML, message);

    hideModal();
    modalEmailInput.value = '';
    emailInput.value = '';
}

// Add message to chat and save to local storage
function addMessageToChat(messageHTML, message) {
    const chatMessages = document.querySelector('.chat-messages'); // Zorg ervoor dat dit de juiste container is
    chatMessages.innerHTML += messageHTML; // Voeg het bericht toe aan de chat
    // Als je wilt, kun je ook de berichten opslaan in localStorage:
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    savedMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}

// Form submission handler
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();

    if (!email) {
        setError(emailInput, 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(email)) {
        setError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (!comment) {
        setError(commentInput, 'Please enter a comment');
        isValid = false;
    } else {
        clearError(commentInput);
    }

    if (!isValid) return;

    const message = {
        email: email, // Not using escapeHtml here, you can sanitize if needed
        comment: comment,
        gifUrl: '', // Add the gifUrl here when necessary
        gravatarUrl: `https://www.gravatar.com/avatar/${CryptoJS.MD5(email.toLowerCase()).toString()}?d=retro`,
        shape: Math.random() < 0.5 ? 'circle' : 'square',
    };

    const messageHTML = `
        <div class="message">
            <img src="${message.gravatarUrl}" 
                 alt="Profile" 
                 class="${message.shape}" 
                 title="${message.email}">
            <div class="message-content">
                <p>${message.comment}</p>
            </div>
            <span class="delete-button">🗑️</span>
        </div>
    `;

    addMessageToChat(messageHTML, message);

    emailInput.value = ''; // Leeg het email veld
    commentInput.value = ''; // Leeg het comment veld
    modalEmailInput.value = ''; // Reset ook de modal email input
    clearError(emailInput);
    clearError(commentInput);
    clearError(modalEmailInput);

});

// Load messages from local storage
function loadMessages() {
    try {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        let messagesHTML = '';

        savedMessages.forEach((msg) => {
            const content = msg.gifUrl
                ? `<img src="${msg.gifUrl.replace('200.gif', 'giphy.gif')}" 
                         alt="GIF" 
                         class="chat-gif" 
                         style="width: 200px; height: 200px;" />` // Forceer hier de grootte
                : `<p>${msg.comment}</p>`;

            messagesHTML += `
                <div class="message" data-id="${msg.timestamp}">
                    <img src="${msg.gravatarUrl}" 
                         alt="Profile" 
                         class="${msg.shape}" 
                         title="${msg.email}">
                    <div class="message-content">
                        ${content}
                    </div>
                    <span class="delete-button">🗑️</span>
                </div>
            `;
        });

        chatMessages.innerHTML = messagesHTML;
        chatMessages.addEventListener('click', handleDeleteMessage);
    } catch (error) {
        console.error('Failed to load messages:', error);
        chatMessages.innerHTML = '<p class="error-message">Error loading messages. Please refresh.</p>';
    }
}

// Handle delete message
function handleDeleteMessage(event) {
    if (event.target.classList.contains('delete-button')) {
        const messageElement = event.target.closest('.message');
        if (messageElement) {
            const messageId = messageElement.dataset.id;
            deleteMessage(messageId);
            messageElement.remove();
        }
    }
}

function deleteMessage(messageId) {
    try {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const updatedMessages = savedMessages.filter(
            (msg) => String(msg.timestamp) !== String(messageId)
        );
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
        console.error('Error deleting message:', error);
        chatMessages.innerHTML += `<p class="error-message">Error deleting message.</p>`;
    }
}


// Theme toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    updateThemeButton();
}

function updateThemeButton() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    themeToggle.setAttribute(
        'aria-label',
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
    );
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

// Initialize theme (localStorage - Hoofdstuk 04 Games)
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}
let selectedGifUrl = '';
// Function to open the modal, set the search query, and fetch GIFs
// Function to open the modal, set the search query, and fetch GIFs
function openGifModal(word) {
    searchQueryDisplay.innerHTML = `You searched for: <strong>${word}</strong>!`;
    gifModalOverlay.style.display = 'flex';

    modalEmailInput.value = emailInput.value.trim(); // Sync de form-email met modal
    clearError(modalEmailInput); // Reset error in modal ook


    const gifApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(word)}&limit=8`;

    fetch(gifApiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            displayGifs(data.data.slice(0, 8));
        })
        .catch(error => {
            console.error('There was a problem fetching GIFs:', error);
            gifResults.textContent = 'Failed to load GIFs.';
        });
}

function displayGifs(gifs) {
    gifResults.innerHTML = gifs.map(gif => `
        <img 
            src="${gif.images.fixed_height.url}" 
            alt="GIF" 
            class="gif-item"
            data-url="${gif.images.fixed_height.url}"
        >
    `).join('');
}
gifResults.addEventListener('click', (e) => {
    if (e.target.classList.contains('gif-item')) {
        selectedGifUrl = e.target.src;

        // Reset alle vorige geselecteerde
        document.querySelectorAll('.gif-item.selected').forEach(el => {
            el.classList.remove('selected');
            el.style.boxShadow = '';
        });

        // Voeg box-shadow toe aan huidige selectie
        e.target.classList.add('selected');
        e.target.style.boxShadow = '0 0 0 4px #007BFF';
    }
});


// BACK button
// BACK button
document.querySelector('#backButton').addEventListener('click', () => {
    gifModalOverlay.style.display = 'none';
});

document.querySelector('#selectButton').addEventListener('click', () => {
    const email = modalEmailInput.value.trim();
    let isValid = true;

    // Reset de foutmelding
    modalEmailError.textContent = '';

    // E-mail validatie
    if (!email) {
        modalEmailError.textContent = 'Please enter your email address'; // Foutmelding voor lege e-mail
        isValid = false;
    } else if (!validateEmail(email)) {
        modalEmailError.textContent = 'Please enter a valid email address'; // Foutmelding voor ongeldige e-mail
        isValid = false;
    }

    // GIF validatie
    if (!selectedGifUrl) {
        if (modalEmailError.textContent) {
            modalEmailError.textContent += ' and a GIF.'; // Voeg toe aan bestaande foutmelding
        } else {
            modalEmailError.textContent = 'Please select a GIF before submitting.'; // Foutmelding voor geen geselecteerde GIF
        }
        isValid = false;
    }

    // Als er een fout is, stop de uitvoering
    if (!isValid) return;

    // Maak het bericht object
    const message = {
        email: email,
        gifUrl: selectedGifUrl,
        gravatarUrl: `https://www.gravatar.com/avatar/${CryptoJS.MD5(email.toLowerCase()).toString()}?d=retro`,
        shape: Math.random() < 0.5 ? 'circle' : 'square',
        timestamp: Date.now() // Gebruik een timestamp als unieke ID
    };

    // HTML voor het bericht
    const messageHTML = `
        <div class="message" data-id="${message.timestamp}">
            <img src="${message.gravatarUrl}" 
                 alt="Profile" 
                 class="${message.shape}" 
                 title="${message.email}">
            <div class="message-content">
                <img src="${message.gifUrl}" 
                     alt="GIF" 
                     class="chat-gif">
            </div>
            <span class="delete-button">🗑️</span>
        </div>
    `;

    // Voeg het bericht toe aan de chat
    addMessageToChat(messageHTML, message);

    // Sluit de modal
    gifModalOverlay.style.display = 'none';

    // Reset de invoervelden en de geselecteerde GIF
    modalEmailInput.value = '';
    selectedGifUrl = null; // Reset de geselecteerde GIF

    // Verwijder de selectie en de box-shadow van de GIFs
    document.querySelectorAll('.gif-item.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.boxShadow = '';
    });
});

// Event listener for double click on the chat messages area
chatMessages.addEventListener('dblclick', (event) => {
    let selectedWord = window.getSelection().toString().trim();
    if (selectedWord) {
        openGifModal(selectedWord);
    }
});

initializeTheme();
themeToggle.addEventListener('click', toggleTheme);
modalClose.addEventListener('click', hideModal);
document.querySelector('#gifModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.querySelector('#gifModalOverlay')) {
        hideModal();
    }
});

// Initialize
initializeTheme();
loadMessages();