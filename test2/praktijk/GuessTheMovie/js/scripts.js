// 1. login (4p)
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const loginNameInput = document.querySelector("#login-name");
    const loginError = document.querySelector("#login-error");
    const mainContainer = document.querySelector("main.container");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const userName = loginNameInput.value.trim();

        if (userName === "") {
            loginError.innerHTML = "Gelieve een naam in te vullen.";
        } else {
            loginError.innerHTML = "";
            loginForm.classList.add("hide");
            mainContainer.classList.remove("hide");

            const userInfo = document.querySelector("#user-info");
            userInfo.innerHTML = `Welkom, ${userName}!`;
        }
    });
});

// 2. thema switcher (2pt)
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const loginNameInput = document.querySelector("#login-name");
    const loginError = document.querySelector("#login-error");
    const mainContainer = document.querySelector("main.container");
    const toggleThemeButton = document.querySelector("#toggle-theme");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const userName = loginNameInput.value.trim();

        if (userName === "") {
            loginError.innerHTML = "Gelieve een naam in te vullen.";
        } else {
            loginError.innerHTML = "";
            loginForm.classList.add("hide");
            mainContainer.classList.remove("hide");

            const userInfo = document.querySelector("#user-info");
            userInfo.innerHTML = `Welkom, ${userName}!`;
        }
    });
    toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
});

// 3. volgende film (4pt)
document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.querySelector("#next-btn");
    const emojiDisplay = document.querySelector("#emoji-display");
    const movieItems = document.querySelectorAll(".movie-item");

    nextButton.addEventListener("click", () => {
        const randomIndex = parseInt(Math.random() * movieItems.length, 10);
        const randomMovie = movieItems[randomIndex];
        const emojis = randomMovie.dataset.emojis;
        emojiDisplay.innerHTML = emojis;
    });
});

// 4. aanklikken film (6pt)
document.addEventListener("DOMContentLoaded", () => {
    const movieItems = document.querySelectorAll(".movie-item");
    const emojiDisplay = document.querySelector("#emoji-display");
    const nextButton = document.querySelector("#next-btn");

    movieItems.forEach((item) => {
        item.addEventListener("click", () => {
            const selectedMovie = item.dataset.emojis;
            const displayedEmojis = emojiDisplay.innerHTML;

            if (displayedEmojis === "") return;

            if (selectedMovie === displayedEmojis) {
                item.classList.add("right");
                item.querySelector("span").innerHTML = "✅";
            } else {
                item.classList.add("wrong");
                item.querySelector("span").innerHTML = "❌";
            }

            emojiDisplay.innerHTML = "";

            checkGame();

            const totalGuessed = document.querySelectorAll(".movie-item.right, .movie-item.wrong").length;
            if (totalGuessed === movieItems.length) {
                nextButton.setAttribute("disabled", "true");
            }
        });
    });

    nextButton.addEventListener("click", () => {
        const availableMovies = Array.from(movieItems).filter(
            (item) => !item.classList.contains("used")
        );

        if (availableMovies.length === 0) {
            nextButton.setAttribute("disabled", "true");
            return;
        }

        const randomIndex = parseInt(Math.random() * availableMovies.length, 10);
        const randomMovie = availableMovies[randomIndex];

        const emojis = randomMovie.dataset.emojis;
        emojiDisplay.innerHTML = emojis;

        randomMovie.classList.add("used");
    });
});

// 5. einde spel (4pt)
function checkGame() {
    const correctAnswers = document.querySelectorAll(".movie-item.right").length;
    const wrongAnswers = document.querySelectorAll(".movie-item.wrong").length;

    document.querySelector("#num-right").innerHTML = correctAnswers;
    document.querySelector("#num-wrong").innerHTML = wrongAnswers;
}

