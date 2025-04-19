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

const API_KEY = 'W1cctClRVfFubkFgtfzQvwX2WblD1hpY';

function showModal() {
    document.querySelector('#gifModalOverlay').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function hideModal() {
    document.querySelector('#gifModalOverlay').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function toggleModal() {
    gifModal.classList.toggle('show');
}

function validateEmail(email) {
    return email.includes('@') && email.split('@')[1].includes('.');
}

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

emailInput.addEventListener('input', () => {
    modalEmailInput.value = emailInput.value;
});

modalEmailInput.addEventListener('input', () => {
    emailInput.value = modalEmailInput.value;
});

emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) {
        clearError(emailInput);
    }
});

commentInput.addEventListener('input', () => {
    if (commentInput.value.trim()) {
        clearError(commentInput);
    }
});

modalEmailInput.addEventListener('input', () => {
    if (modalEmailInput.value.trim() && validateEmail(modalEmailInput.value.trim())) {
        clearError(modalEmailInput);
    }
});

function getUsernameFromEmail(email) {
    const username = email.split('@')[0];
    return username;
}

function getGravatarUrl(email) {
    const emailHash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${emailHash}?d=retro&s=100`;
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

function addMessageToChat(messageHTML, message) {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML += messageHTML;

    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    message.id = generateUniqueId();
    savedMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}

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
        email: email,
        comment: comment,
        gifUrl: '',
        gravatarUrl: getGravatarUrl(email),
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

    emailInput.value = '';
    commentInput.value = '';
    modalEmailInput.value = '';
    clearError(emailInput);
    clearError(commentInput);
    clearError(modalEmailInput);
});

function generateUniqueId() {
    const currentId = parseInt(localStorage.getItem('messageIdCounter') || '0', 10);
    const newId = currentId + 1;
    localStorage.setItem('messageIdCounter', newId.toString());
    return newId.toString();
}

function loadMessages() {
    try {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        let messagesHTML = '';

        savedMessages.forEach((msg) => {
            const content = msg.gifUrl
                ? `<img src="${msg.gifUrl}" 
                         alt="GIF" 
                         class="chat-gif" 
                         style="max-width: 300px; max-height: 300px;">` // Ensure consistent size
                : `<p>${msg.comment}</p>`;

            messagesHTML += `
                <div class="message" data-id="${msg.id}">
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
            (msg) => msg.id !== messageId
        );
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

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

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

let selectedGifUrl = '';

function openGifModal(word) {
    currentGifPage = 0;
    currentSearchQuery = word;
    searchQueryDisplay.innerHTML = `You searched for: <strong>${word}</strong>!`;
    gifModalOverlay.style.display = 'flex';

    modalEmailInput.value = emailInput.value.trim();
    clearError(modalEmailInput);

    fetchGifs(word, currentGifPage);

    document.querySelector('#prevGifs').disabled = true;
}

function fetchGifs(query, page) {
    const offset = page * 8;
    const gifApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=8&offset=${offset}`;

    fetch(gifApiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            displayGifs(data.data);

            document.querySelector('#prevGifs').disabled = page === 0;
            document.querySelector('#nextGifs').disabled = data.pagination.total_count <= offset + 8;
        })
        .catch(error => {
            gifResults.textContent = 'Failed to load GIFs.';
        });
}

function displayGifs(gifs) {
    gifResults.innerHTML = gifs.map(gif => `
        <img 
            src="${gif.images.fixed_height.url}" 
            alt="GIF" 
            class="gif-item ${selectedGifUrl === gif.images.fixed_height.url ? 'selected' : ''}"
            data-url="${gif.images.fixed_height.url}"
            style="${selectedGifUrl === gif.images.fixed_height.url ? 'box-shadow: 0 0 0 4px #007BFF;' : ''}"
        >
    `).join('');
}

gifResults.addEventListener('click', (e) => {
    if (e.target.classList.contains('gif-item')) {
        if (e.target.classList.contains('selected')) {
            e.target.classList.remove('selected');
            e.target.style.boxShadow = '';
            selectedGifUrl = null;
        } else {
            document.querySelectorAll('.gif-item.selected').forEach(el => {
                el.classList.remove('selected');
                el.style.boxShadow = '';
            });

            e.target.classList.add('selected');
            e.target.style.boxShadow = '0 0 0 4px #007BFF';
            selectedGifUrl = e.target.dataset.url;
        }
    }
});

document.querySelector('#prevGifs').addEventListener('click', () => {
    if (currentGifPage > 0) {
        currentGifPage--;
        fetchGifs(currentSearchQuery, currentGifPage);
    }
});

document.querySelector('#nextGifs').addEventListener('click', () => {
    currentGifPage++;
    fetchGifs(currentSearchQuery, currentGifPage);
});

document.querySelector('#backButton').addEventListener('click', () => {
    gifModalOverlay.style.display = 'none';
});

document.querySelector('#selectButton').addEventListener('click', () => {
    const email = modalEmailInput.value.trim();
    let isValid = true;

    modalEmailError.textContent = '';

    if (!email) {
        modalEmailError.textContent = 'Please enter your email address';
        isValid = false;
    } else if (!validateEmail(email)) {
        modalEmailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }

    if (!selectedGifUrl) {
        if (modalEmailError.textContent) {
            modalEmailError.textContent += ' and a GIF.';
        } else {
            modalEmailError.textContent = 'Please select a GIF before submitting.';
        }
        isValid = false;
    }

    if (!isValid) return;

    const emailHash = email.trim().toLowerCase();
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=retro&s=100`;

    const message = {
        email: email,
        gifUrl: selectedGifUrl,
        gravatarUrl: gravatarUrl,
        shape: Math.random() < 0.5 ? 'circle' : 'square',
    };

    const messageHTML = `
        <div class="message">
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

    addMessageToChat(messageHTML, message);

    gifModalOverlay.style.display = 'none';

    modalEmailInput.value = '';
    selectedGifUrl = null;

    document.querySelectorAll('.gif-item.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.boxShadow = '';
    });
});

chatMessages.addEventListener('dblclick', (event) => {
    const selectedWord = event.target.textContent.trim();
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

initializeTheme();
loadMessages();
