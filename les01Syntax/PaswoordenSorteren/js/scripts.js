function controleerWachtwoord(wachtwoord) {
    // Controleert of wachtwoord minimaal 9 tekens heeft en geen @ bevat
    if (wachtwoord.length >= 9 && !wachtwoord.includes('@')) {
        return true;
    }
    return false;
}

function sorteerWachtwoorden(wachtwoorden) {
    var ok = [];
    var nietOk = [];
    // Gaat door elk wachtwoord heen en voegt toe aan juiste lijst
    for (var i = 0; i < wachtwoorden.length; i++) {
        var wachtwoord = wachtwoorden[i];
        if (controleerWachtwoord(wachtwoord)) {
            ok.push(wachtwoord);
        } else {
            nietOk.push(wachtwoord);
        }
    }
    // Toon alle wachtwoorden
    console.log("Alle paswoorden:");
    wachtwoorden.forEach(function(wachtwoord, index) {
        console.log(`${index + 1}. ${wachtwoord}`);
    });
    console.log('');

    // Toon goede en slechte wachtwoorden
    console.log('%cOk: %c' + ok.join(', '), 'color: green', 'color: green');
    console.log('%cNiet ok: %c' + nietOk.join(', '), 'color: red', 'color: red');
}

// Wachtwoorden
var wachtwoorden = ["klepketoe", "test", "Azerty123", "rogier@work", "paswoord", "MisterNasty12", "pwnz0red"];

// Voer sorteerfunctie uit
sorteerWachtwoorden(wachtwoorden);