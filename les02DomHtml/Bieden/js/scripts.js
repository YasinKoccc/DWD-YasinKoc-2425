let highestBid = 0;
let highestBidder = '';

const bidForm = document.querySelector('#bidForm');
const bidderNameInput = document.querySelector('#bidderName');
const bidAmountInput = document.querySelector('#bidAmount');
const messageDiv = document.querySelector('#message');

bidForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const bidderName = bidderNameInput.value;
    const bidAmount = parseFloat(bidAmountInput.value);

    if (bidAmount > highestBid) {
        highestBid = bidAmount;
        highestBidder = bidderName;
        messageDiv.innerHTML = "Gefeliciteerd! Jij hebt het hoogste bod.";
    } else {
        messageDiv.innerHTML = `Jammer! ${highestBidder} heeft een hoger bod.`;
    }

    // Manually clear the input fields instead of using form.reset()
    bidderNameInput.value = '';
    bidAmountInput.value = '';
});
