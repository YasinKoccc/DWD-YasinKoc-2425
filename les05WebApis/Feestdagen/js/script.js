document.querySelector('#buttonCheck').addEventListener('click', async () => {
    const inputDate = document.querySelector('#datepicker').value;
    const resultaatElem = document.querySelector('#resultaat');

    if (!inputDate) {
        resultaatElem.innerHTML = "Voer een geldige datum in.";
        resultaatElem.style.color = "";
        return;
    }

    const dateObj = new Date(inputDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const apiKey = '20b3e1c879f140689843408785327737';
    const apiUrl = `https://holidays.abstractapi.com/v1/?api_key=${apiKey}&country=BE&year=${year}&month=${month}&day=${day}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error('Er is een netwerkfout opgetreden.');
            resultaatElem.innerHTML = "Er is een netwerkfout opgetreden.";
            resultaatElem.style.color = "black";
            return;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            resultaatElem.innerHTML = `🎉 ${formattedDate} is een feestdag! 🎉`;
            resultaatElem.style.color = "green";
        } else {
            resultaatElem.innerHTML = `❌ ${formattedDate} is geen feestdag.`;
            resultaatElem.style.color = "red";
        }
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
        resultaatElem.innerHTML = "Er is een fout opgetreden tijdens het ophalen van de data.";
        resultaatElem.style.color = "black";
    }
});
