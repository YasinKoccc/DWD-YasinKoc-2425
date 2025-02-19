document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.querySelector('#inpEmail');
    const sizeSelect = document.querySelector('#selMeasure');
    const modelLinks = document.querySelectorAll('#model a');
    const accessoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const orderSummary = document.querySelector('#lblMessage');
    const orderButton = document.querySelector('#frmOrder');
    const emailError = document.querySelector('#msgEmail');
    const sizeError = document.querySelector('#msgMeasure');
    const imgShoe = document.querySelector('#figShoe img');
    const lblShoe = document.querySelector('#figShoe figcaption span');

    // Model selectie
    modelLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const currentSelected = document.querySelector('#model .selected');
            if (currentSelected) currentSelected.classList.remove('selected');
            link.classList.add('selected');
            const modelName = link.innerHTML;
            imgShoe.src = link.href;
            lblShoe.innerHTML = modelName;
        });
    });

    // Formuliercontrole
    orderButton.addEventListener('submit', function (e) {
        e.preventDefault();
        let numErrors = 0;
        emailError.innerHTML = '';
        sizeError.innerHTML = '';

        // Controleer e-mail
        const email = emailInput.value.trim();
        if (!email) {
            numErrors++;
            emailError.innerHTML = 'email mag niet leeg zijn';
        } else if (!email.includes('@')) {
            numErrors++;
            emailError.innerHTML = 'Vul een geldig e-mailadres in.';
        }

        // Controleer maat
        const size = sizeSelect.value;
        if (!size) {
            numErrors++;
            sizeError.innerHTML = 'selecteer je maat';
        }

        if (numErrors === 0) {
            let totalPrice = 54.99;
            let selectedAccessories = [];

            accessoryCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const priceText = checkbox.closest('label').innerHTML;
                    const priceMatch = priceText.match(/\d+\.\d+/);
                    if (priceMatch) {
                        const price = parseFloat(priceMatch[0]);
                        totalPrice += price;
                        selectedAccessories.push(priceText.split('+')[0].trim());
                    } else {
                        console.error("Fout: Prijs niet gevonden voor accessoire.");
                    }
                }
            });

            const selectedModel = document.querySelector('#model .selected').innerHTML;
            const selectedSize = sizeSelect.value;
            orderSummary.innerHTML = `Je keuze: ${selectedModel} maat ${selectedSize}, ${selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'geen accessoires'} (totaalprijs: € ${totalPrice.toFixed(2)})`;
        }
    });
});