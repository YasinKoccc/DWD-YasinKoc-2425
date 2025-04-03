// declarations
document.addEventListener("DOMContentLoaded", () => {
    const inpNumber = document.querySelector("#inpNumber");
    const selType = document.querySelector("#selType");
    const btnFetch = document.querySelector("#btnFetch");
    const btnRandom = document.querySelector("#btnRandom");
    const facts = document.querySelector("#facts");

    // functions
        const fetchFact = async (value, type) => {
        try {
            const response = await fetch(`http://numbersapi.com/${value}/${type}`);
            const fact = await response.text();
            facts.innerHTML = `<p>${fact}</p>`;
        } catch (error) {
            facts.innerHTML = `<p>Er is een fout opgetreden bij het ophalen van het weetje.</p>`;
            console.error(error);
        }
    };

    // events
    btnFetch.addEventListener("click", () => {
        const value = inpNumber.value.trim();
        const type = selType.value;

        if (value === "") {
            facts.innerHTML = `<p>Voer een waarde in.</p>`;
            return;
        }

        fetchFact(value, type);
    });

    btnRandom.addEventListener("click", () => {
        const type = selType.value;
        let randomValue;

        if (type === "year") {
            randomValue = parseInt(Math.random() * 2024) + 1;
        } else if (type === "date") {
            const month = parseInt(Math.random() * 12) + 1;
            const day = parseInt(Math.random() * 28) + 1;
            randomValue = `${month}/${day}`;
        } else {
            randomValue = parseInt(Math.random() * 100) + 1;
        }

        inpNumber.value = randomValue;
        fetchFact(randomValue, type);
    });
});