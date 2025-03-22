// CONSTANTS
// =========
const API_BASE_URL = 'https://api.chucknorris.io/';
const selCats    = document.querySelector('#selCats');
const msgCats    = document.querySelector('#msgCats');
const inpSearch  = document.querySelector('#inpSearch');
const btnGo      = document.querySelector('#btnGo');
const quoteSpan  = document.querySelector('#quote span');

// FUNCTIONS
// =========

function populateDropdown(categories) {
   let optionsHTML = '<option value="">Select a category</option>';

   categories.forEach(category => {
      optionsHTML += `<option value="${category}">${category}</option>`;
   });

   selCats.innerHTML = optionsHTML;

   msgCats.style.display = 'none';
}
 
function displayQuote(quoteText) {
  quoteSpan.innerHTML = quoteText;
  document.querySelector('#quote').classList.add('show');
}

// API CALLS

async function getCategories() {
  let categories = JSON.parse(localStorage.getItem('chuckCategories') || '[]');
  if (categories.length > 0) {
    return categories;
  }
  try {
    const response = await fetch(API_BASE_URL + 'jokes/categories');
    if (response.ok) {
      categories = await response.json();
      localStorage.setItem('chuckCategories', JSON.stringify(categories));
      return categories;
    } else {
      console.error('Network error fetching categories.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getRandomQuoteByCategory(category) {
  try {
    const response = await fetch(API_BASE_URL + `jokes/random?category=${encodeURIComponent(category)}`);
    if (response.ok) {
      const data = await response.json();
      return data.value;
    } else {
      console.error('Network error fetching quote by category.');
      return 'Network error occurred.';
    }
  } catch (error) {
    console.error('Error in getRandomQuoteByCategory:', error);
    return 'Error occurred while fetching quote.';
  }
}

async function getRandomQuote() {
  try {
    const response = await fetch(API_BASE_URL + 'jokes/random');
    if (response.ok) {
      const data = await response.json();
      return data.value;
    } else {
      console.error('Network error fetching random quote.');
      return 'Network error occurred.';
    }
  } catch (error) {
    console.error('Error in getRandomQuote:', error);
    return 'Error occurred while fetching quote.';
  }
}

async function searchQuoteByKeywordAndCategory(keyword, category) {
  try {
    const response = await fetch(API_BASE_URL + `jokes/search?query=${encodeURIComponent(keyword)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.total > 0 && data.result.length > 0) {
        const filtered = data.result.filter(item => item.categories.includes(category));
        if (filtered.length > 0) {
          return filtered[0].value;
        } else {
          return 'No quotes found for this combination.';
        }
      } else {
        return 'No results found for this keyword.';
      }
    } else {
      console.error('Network error during search.');
      return 'Network error occurred.';
    }
  } catch (error) {
    console.error('Error in searchQuoteByKeywordAndCategory:', error);
    return 'Error occurred while searching for quote.';
  }
}

// EVENT HANDLERS
// ==============

async function onGoClick() {
  const selectedCategory = selCats.value;
  const keyword = inpSearch.value.trim();

  if (!selectedCategory) {
    displayQuote('Please select a category.');
    return;
  }

  if (keyword) {
    const quote = await searchQuoteByKeywordAndCategory(keyword, selectedCategory);
    displayQuote(quote);
  } else {
    const quote = await getRandomQuoteByCategory(selectedCategory);
    displayQuote(quote);
  }
}

// EVENTS
// ======
function addEventListeners() {
  btnGo.addEventListener('click', onGoClick);

  document.addEventListener("keyup", async (e) => {
    if (e.key.toLowerCase() === 'r') {
      let quote;
      const selectedCategory = selCats.value;
      if (selectedCategory) {
        quote = await getRandomQuoteByCategory(selectedCategory);
      } else {
        quote = await getRandomQuote();
      }
      displayQuote(quote);
    }
  });
}

// STARTUP
// =======
async function startApp() {
  const categories = await getCategories();
  if (categories.length > 0) {
    populateDropdown(categories);
  } else {
    msgCats.innerHTML = 'Unable to fetch categories.';
  }
  addEventListeners();
}

startApp();
