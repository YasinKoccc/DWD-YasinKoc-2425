// Constanten
const AANTAL_SPELERS = 10000;
const MIN_GETAL = 1000;
const MAX_GETAL = 9999;

// Functie om een random getal te genereren
function genereerGetal() {
    return Math.round(Math.random() * (MAX_GETAL - MIN_GETAL)) + MIN_GETAL;
}

// Functie om het aantal juiste cijfers te berekenen
function aantalJuisteCijfers(trekking, getal) {
    if (trekking === getal) return 4;
    if (trekking % 1000 === getal % 1000) return 3;
    if (trekking % 100 === getal % 100) return 2;
    if (trekking % 10 === getal % 10) return 1;
    return 0;
}

// Functie om het gemiddelde te berekenen
function gemiddelde(array) {
    let som = 0;
    for (let i = 0; i < array.length; i++) {
        som += array[i];
    }
    return som / array.length;
}

// Functie jokertrekking
function simuleerJokertrekking() {
    const trekking = genereerGetal();
    
    // Trekking
    console.log("%c// trekking", "color: #c72693; font-size: 18px;");
    console.log("Getrokken getal: " + trekking);
    console.log("");

    // Een array voor 0 tot 4 juiste cijfers
    const winsten = [0, 0, 0, 0, 0];
    const winstenBedragen = [0, 2.5, 10, 100, 500];

    // Gokken
    for (let i = 0; i < AANTAL_SPELERS; i++) {
        const spelerGetal = genereerGetal();
        const juisteCijfers = aantalJuisteCijfers(trekking, spelerGetal);
        winsten[juisteCijfers]++;
    }
    console.log("%c// gokken", "color: #c72693; font-size: 18px;");
    console.log("Aantal iteraties: " + AANTAL_SPELERS);
    console.log("");

    // Resultaten
    console.log("%c// resultaten", "color: #c72693; font-size: 18px;");
    for (let i = 0; i < winsten.length; i++) {
        console.log(`${i} juist: ${winsten[i]}`);
    }

    // Bereken totale winst en gemiddelde winst
    let totaleWinst = 0;
    for (let i = 0; i < winsten.length; i++) {
        totaleWinst += winsten[i] * winstenBedragen[i];
    }
    const gemiddeldeWinst = totaleWinst / AANTAL_SPELERS;

    // Gemiddelde winst met geel tekst op grijze achtergrond
    console.log("");
    console.log("%cGemiddelde winst: €" + Math.round(gemiddeldeWinst * 1000) / 1000, "color: yellow; background-color: grey; padding: 10px;");
}

// Simuleer jokertrekking
simuleerJokertrekking();