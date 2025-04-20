// Declaratie van variabelen die worden gebruikt in de chatapplicatie
const chatForm = document.querySelector('#chatForm');
const emailInput = document.querySelector('#email');
const commentInput = document.querySelector('#comment');
const chatMessages = document.querySelector('#chatMessages');
const gifButton = document.querySelector('#gifButton');
const gifModal = document.querySelector('#gifModal');
const gifResults = document.querySelector('#gifResults');
const modalEmailInput = document.querySelector('#modalEmail');
const modalEmailError = document.querySelector('#modalEmailError');
const themeToggle = document.querySelector('#themeToggle');
const gifModalOverlay = document.querySelector('#gifModalOverlay');
const searchQueryDisplay = document.querySelector('#searchQueryDisplay');
const typingBar = document.querySelector('.typing-bar span');

// API-key voor Giphy
// Deze sleutel is nodig om toegang te krijgen tot de Giphy API en GIF's op te halen.
const API_KEY = 'W1cctClRVfFubkFgtfzQvwX2WblD1hpY';

// Toont de GIF-modal door de overlay en body aan te passen
function showModal() {
    document.querySelector('#gifModalOverlay').classList.add('show');
    document.body.classList.add('modal-open');
}

// Verbergt de GIF-modal door de overlay en body terug te zetten
function hideModal() {
    document.querySelector('#gifModalOverlay').classList.remove('show');
    document.body.classList.remove('modal-open');
}

// Wisselt de zichtbaarheid van de modal (open/dicht)
function toggleModal() {
    gifModal.classList.toggle('show');
}

// Controleert of het e-mailadres een geldig patroon bevat
function validateEmail(email) {
    return email.includes('@') && email.split('@')[1].includes('.');
}

// Toont een foutmelding onder een inputveld
function setError(inputElement, message) {
    const errorMessage = inputElement.nextElementSibling;
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    inputElement.classList.add('error');
}

// Verwijdert een foutmelding onder een inputveld
function clearError(inputElement) {
    const errorMessage = inputElement.nextElementSibling;
    errorMessage.textContent = ''; // Wis de foutmeldingstekst
    errorMessage.classList.remove('show');
    inputElement.classList.remove('error');
}

// Synchroniseert het e-mailadres tussen het hoofdformulier en de modal
emailInput.addEventListener('input', () => {
    modalEmailInput.value = emailInput.value;
});


// Synchroniseert de waarde van het e-mailadres van de modal naar het hoofdformulier
modalEmailInput.addEventListener('input', () => {
    emailInput.value = modalEmailInput.value;
});

// Verwijdert de foutmelding in realtime als het e-mailadres in het hoofdformulier geldig wordt
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) {
        clearError(emailInput); // Wis de foutmelding realtime
    }
});

// Verwijdert de foutmelding in realtime zodra het commentaarveld niet meer leeg is
commentInput.addEventListener('input', () => {
    if (commentInput.value.trim()) {
        clearError(commentInput);
    }
});

// Verwijdert de foutmelding in realtime als het e-mailadres in de modal geldig wordt
modalEmailInput.addEventListener('input', () => {
    if (modalEmailInput.value.trim() && validateEmail(modalEmailInput.value.trim())) {
        clearError(modalEmailInput);
    }
});


// Deze functie genereert de URL voor de Gravatar-profielfoto op basis van het e-mailadres van de gebruiker.
// Gravatar verwacht een MD5-gehashte versie van het e-mailadres in kleine letters zonder spaties.
// Daarom gebruiken we md5() op email.trim().toLowerCase().
// De gegenereerde URL toont een profielfoto als het e-mailadres geregistreerd is bij Gravatar,
// of een standaardafbeelding ('retro') als dat niet het geval is.
// Gebaseerd op: https://stackoverflow.com/questions/14733374/how-to-generate-an-md5-hash-from-a-string-in-javascript-node-js
// Gebaseerd op: https://docs.gravatar.com/api/avatars/hash/
function getGravatarUrl(email) {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=retro&s=100`;
}



// Verwerkt de selectie van een GIF vanuit de modal
function handleGifSelection(gifUrl) {
    const email = modalEmailInput.value.trim();

    // Controleer of e-mailadres ingevuld is
    if (!email) {
        setError(modalEmailInput, 'Please enter your email address!');
        return;
    }

    // Controleer of e-mailadres geldig is
    if (!validateEmail(email)) {
        setError(modalEmailInput, 'Please enter a valid email address!');
        return;
    }

    // Wis foutmeldingen als alles in orde is
    clearError(modalEmailInput);

    // Bouw het message-object op met e-mail, gif en gravatar info
    const message = {
        email: email,
        comment: '',
        gravatarUrl: `https://www.gravatar.com/avatar/?d=retro`, // standaard gravatar afbeelding
        gifUrl: gifUrl,
        shape: Math.random() < 0.5 ? 'circle' : 'square' // willekeurige vorm voor profielfoto
    };

    // HTML-string voor het bericht met GIF en gravatar
    const messageHTML = `
        <div class="message">
            <img src="${message.gravatarUrl}" 
                 alt="Profile" 
                 class="${message.shape}" 
                 title="${message.email}">
            <div class="message-content">
                <img src="${gifUrl.replaceAll('200.gif', 'giphy.gif')}" 
                    alt="GIF" 
                    class="chat-gif">
            </div>
            <span class="delete-button">🗑️</span>
        </div>
    `;

    // Voeg bericht toe aan de chat en sla het op in localStorage
    addMessageToChat(messageHTML, message);

    // Sluit de modal en wis de e-mailvelden
    hideModal();
    modalEmailInput.value = '';
    emailInput.value = '';
}

// Voegt het gegenereerde bericht toe aan de chat en slaat het op in localStorage
function addMessageToChat(messageHTML, message) {
    const chatMessages = document.querySelector('.chat-messages');

    // Voeg het bericht toe aan de bestaande chatinhoud
    chatMessages.innerHTML += messageHTML;

    // Haal bestaande berichten op, voeg het nieuwe toe en sla opnieuw op
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    message.id = generateUniqueId(); // unieke ID voor elk bericht
    savedMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}

// Event listener voor het versturen van het chatformulier
chatForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Voorkom herladen van de pagina
    let isValid = true;

    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();

    // Valideer e-mailadres: vereist en moet geldig zijn
    if (!email) {
        setError(emailInput, 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(email)) {
        setError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(emailInput); // Wis de foutmelding als de invoer geldig is
    }

    // Valideer comment: mag niet leeg zijn
    if (!comment) {
        setError(commentInput, 'Please enter a comment');
        isValid = false;
    } else {
        clearError(commentInput);
    }

    // Stop als één van beide velden ongeldig is
    if (!isValid) return;

    // Bouw het message-object op voor de chat
    const message = {
        email: email,
        comment: comment,
        gifUrl: '',
        gravatarUrl: getGravatarUrl(email), // Gravatar op basis van e-mail
        shape: Math.random() < 0.5 ? 'circle' : 'square', // Willekeurige vorm voor profielfoto
    };

    // HTML-output van het bericht met gravatar en tekst
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

    // Voeg bericht toe aan de chat en sla het op in localStorage
    addMessageToChat(messageHTML, message);

    // Wis invoervelden en foutmeldingen na verzenden
    emailInput.value = '';
    commentInput.value = '';
    modalEmailInput.value = '';
    clearError(emailInput);
    clearError(commentInput);
    clearError(modalEmailInput);
});

// Genereert een uniek ID voor elk bericht en slaat de teller op in localStorage
function generateUniqueId() {
    const currentId = parseInt(localStorage.getItem('messageIdCounter') || '0', 10); // Haal huidige ID
    const newId = currentId + 1; // Verhoog ID
    localStorage.setItem('messageIdCounter', newId.toString()); // Sla nieuwe waarde op
    return newId.toString(); // Geef unieke ID terug
}

// Laadt alle opgeslagen berichten uit localStorage en toont ze in de chat
function loadMessages() {
    try {
        // Haal berichten op uit localStorage of gebruik een lege array als fallback
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        let messagesHTML = '';

        // Genereer HTML voor elk bericht
        savedMessages.forEach((msg) => {
            const content = msg.gifUrl
                ? `<img src="${msg.gifUrl}" 
                        alt="GIF" 
                        class="chat-gif">`
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

        // Voeg alle berichten toe aan de chatcontainer
        chatMessages.innerHTML = messagesHTML;

        // Voeg event listener toe voor het verwijderen van berichten
        chatMessages.addEventListener('click', handleDeleteMessage);
    } catch (error) {
        // Foutafhandeling als berichten niet geladen kunnen worden
        console.error('Failed to load messages:', error);
        chatMessages.innerHTML = '<p class="error-message">Error loading messages. Please refresh.</p>';
    }
}

// Verwijdert een bericht uit de interface en localStorage wanneer op het prullenbak-icoon wordt geklikt
function handleDeleteMessage(event) {
    if (event.target.classList.contains('delete-button')) {
        const messageElement = event.target.closest('.message'); // Zoek het bovenliggende message-element
        if (messageElement) {
            const messageId = messageElement.dataset.id; // Haal ID op uit data-attribuut
            deleteMessage(messageId); // Verwijder uit localStorage
            messageElement.remove(); // Verwijder uit DOM
        }
    }
}

// Verwijder een bericht uit localStorage op basis van het meegegeven ID
function deleteMessage(messageId) {
    try {
        // Haal alle opgeslagen berichten op
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

        // Filter het bericht eruit dat overeenkomt met het opgegeven ID
        const updatedMessages = savedMessages.filter(
            (msg) => msg.id !== messageId
        );

        // Sla de bijgewerkte lijst terug op in localStorage
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
        // Toon foutmelding als verwijderen mislukt
        console.error('Error deleting message:', error);
    }
}

// Initialiseert het thema (donker/licht) op basis van wat is opgeslagen in localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    // Voeg 'dark-mode' toe aan body als de opgeslagen modus 'dark' is
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');

    // Update de knop zodat deze het juiste icoon en label toont
    updateThemeButton();
}

// Past de tekst en aria-label van de thema-knop aan op basis van het actieve thema
function updateThemeButton() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Toon ☀️ bij donker thema (voor switch naar licht), 🌙 bij licht thema
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    themeToggle.setAttribute(
        'aria-label',
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
    );
}

// Wissel tussen licht en donker thema en sla de voorkeur op in localStorage
function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    // Sla huidige thema op in localStorage
    localStorage.setItem('theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light');

    // Werk de knop bij
    updateThemeButton();
}

// Als 'darkMode' handmatig als true is opgeslagen (oude implementatie?), activeer donker thema
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// Houdt de geselecteerde GIF-URL bij (wordt later gebruikt bij toevoegen aan chat)
let selectedGifUrl = '';

// Opent de GIF-modal met resultaten op basis van het opgegeven zoekwoord
function openGifModal(word) {
    currentGifPage = 0; // Reset de paginacount
    currentSearchQuery = word; // Sla de huidige zoekterm op

    // Toon de zoekterm in de UI
    searchQueryDisplay.innerHTML = `You searched for: '<strong>${word}</strong>' !` ;

    // Toon de overlay van de GIF-modal
    gifModalOverlay.style.display = 'flex';

    // Zet de e-mail in de modal gelijk aan de gewone invoer
    modalEmailInput.value = emailInput.value.trim();
    clearError(modalEmailInput); // Verwijder eventuele foutmeldingen

    // Haal GIFs op voor de zoekterm
    fetchGifs(word, currentGifPage);

    // Schakel 'vorige'-knop uit bij eerste pagina
    document.querySelector('#prevGifs').disabled = true;
}

// Haalt GIFs op via de Giphy API op basis van zoekterm en pagina
async function fetchGifs(query, page) {
    const offset = page * 8; // Bepaal offset voor paginatie
    const gifApiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=8&offset=${offset}`;

    try {
        // Stuur API-verzoek
        const response = await fetch(gifApiUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        // Parse JSON-antwoord
        const data = await response.json();

        // Toon de resultaten in de UI
        displayGifs(data.data);

        // Schakel 'vorige'-knop uit op pagina 0
        document.querySelector('#prevGifs').disabled = page === 0;

        // Schakel 'volgende'-knop uit als er geen verdere resultaten zijn
        document.querySelector('#nextGifs').disabled = data.pagination.total_count <= offset + 8;
    } catch (error) {
        // Toon foutmelding bij mislukte API-call
        gifResults.textContent = 'Failed to load GIFs.';
    }
}

// Toont de GIFs in de zoekresultaten, markeert de geselecteerde GIF
function displayGifs(gifs) {
    gifResults.innerHTML = gifs.map(gif => `
        <img 
            src="${gif.images.fixed_height.url}" 
            alt="GIF" 
            class="gif-item chat-gif ${selectedGifUrl === gif.images.fixed_height.url ? 'gif-selected' : ''}"
            data-url="${gif.images.fixed_height.url}"
        >
    `).join('');
}



// Event listener voor het klikken op een GIF-item in de zoekresultaten
gifResults.addEventListener('click', (e) => {
    if (e.target.classList.contains('gif-item')) {
        const selectedGif = e.target;

        // Controleer of de GIF al geselecteerd is
        if (selectedGifUrl === selectedGif.dataset.url) {
            // Deselecteer de GIF als deze al geselecteerd is
            selectedGif.classList.remove('gif-selected');
            selectedGif.style.boxShadow = ''; // Verwijder de boxShadow
            selectedGifUrl = ''; // Verwijder de geselecteerde GIF URL
        } else {
            // Deselecteer alle andere geselecteerde GIFs
            document.querySelectorAll('.gif-item.gif-selected').forEach(el => {
                el.classList.remove('gif-selected');
                el.style.boxShadow = ''; // Verwijder de boxShadow
            });

            // Selecteer de nieuwe GIF
            selectedGif.classList.add('gif-selected');
            selectedGif.style.boxShadow = '0px 0px 10px 2px blue'; // Voeg de boxShadow toe
            selectedGifUrl = selectedGif.dataset.url; // Update de geselecteerde GIF URL
        }
    }
});



// Event listener voor de vorige pagina knop van de GIF-paginering
document.querySelector('#prevGifs').addEventListener('click', () => {
    if (currentGifPage > 0) { // Controleer of er meer pagina's zijn
        currentGifPage--; // Verlaag de huidige pagina
        fetchGifs(currentSearchQuery, currentGifPage); // Haal de GIFs op voor de vorige pagina
    }
});

// Event listener voor de volgende pagina knop van de GIF-paginering
document.querySelector('#nextGifs').addEventListener('click', () => {
    currentGifPage++; // Verhoog de huidige pagina
    fetchGifs(currentSearchQuery, currentGifPage); // Haal de GIFs op voor de volgende pagina
});

// Event listener voor de sluitknop van de GIF-modal
document.querySelector('#backButton').addEventListener('click', () => {
    gifModalOverlay.style.display = 'none'; // Verberg de GIF-modal-overlay
});

// Voeg een event listener toe voor de 'selectButton' klik
document.querySelector('#selectButton').addEventListener('click', () => {
    const email = modalEmailInput.value.trim(); // Haal het e-mailadres op
    let isValid = true;

    modalEmailError.textContent = ''; // Reset eventuele foutmeldingen

    // Controleer of het e-mailadres leeg is of niet geldig is
    if (!email) {
        modalEmailError.textContent = 'Please enter your email address';
        isValid = false;
    } else if (!validateEmail(email)) {
        modalEmailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Controleer of er een GIF is geselecteerd
    if (!selectedGifUrl) {
        if (modalEmailError.textContent) {
            modalEmailError.textContent += ' and a GIF.'; // Voeg bericht toe aan foutmelding als er al een fout is
        } else {
            modalEmailError.textContent = 'Please select a GIF before submitting.'; // Geef foutmelding weer voor geen geselecteerde GIF
        }
        isValid = false;
    }

    if (!isValid) return; // Stop de functie als er een fout is

    // Genereer Gravatar-URL op basis van het e-mailadres
    const emailHash = email.trim().toLowerCase();
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=retro&s=100`;

    // Maak een nieuw bericht object
    const message = {
        email: email,
        gifUrl: selectedGifUrl,
        gravatarUrl: gravatarUrl,
        shape: Math.random() < 0.5 ? 'circle' : 'square', // Willekeurig bepalen of de afbeelding rond of vierkant is
    };

    // Maak de HTML voor het bericht
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

    // Voeg het bericht toe aan de chat
    addMessageToChat(messageHTML, message);

    // Verberg de GIF-modal en reset de invoervelden
    gifModalOverlay.style.display = 'none';
    modalEmailInput.value = '';
    selectedGifUrl = null;

    // Verwijder de selectie van de GIFs
    document.querySelectorAll('.gif-item.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.boxShadow = '';
    });
});

// Voeg een event listener toe voor dubbelklikken op een bericht om een zoekopdracht voor een GIF te openen
chatMessages.addEventListener('dblclick', (event) => {
    const selectedWord = event.target.textContent.trim(); // Haal de geselecteerde tekst op
    if (selectedWord) {
        openGifModal(selectedWord); // Open de GIF-modal met de geselecteerde tekst
    }
});

// Initialiseer het thema bij het laden van de pagina
initializeTheme();

// Voeg een event listener toe voor het schakelen tussen licht/donker thema
themeToggle.addEventListener('click', toggleTheme);

// Voeg een event listener toe voor het sluiten van de GIF-modal als de overlay wordt aangeklikt
document.querySelector('#gifModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.querySelector('#gifModalOverlay')) {
        hideModal(); // Verberg de modal
    }
});

// Initialiseer het thema bij het laden van de pagina
initializeTheme();

// Laad eerder opgeslagen berichten
loadMessages();
