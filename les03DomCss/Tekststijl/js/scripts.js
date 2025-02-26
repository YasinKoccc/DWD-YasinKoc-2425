function applyStyle(styleNumber) {
    const textElement = document.querySelector('#text');
    const textContainer = document.querySelector('.text-container');

    textElement.style.textShadow = '';
    textContainer.classList.remove('rainbow-bg');
    textElement.style.transform = '';

    textElement.style.fontWeight = document.querySelector('#bold').checked ? 'bold' : 'normal';
    textElement.style.fontStyle = document.querySelector('#italic').checked ? 'italic' : 'normal';
    textElement.style.textTransform = document.querySelector('#uppercase').checked ? 'uppercase' : 'none';

    switch (styleNumber) {
        case 1:
            textElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            break;
        case 2:
            textContainer.classList.add('rainbow-bg');
            break;
        case 3:
            textElement.style.display = 'inline-block';
            textElement.style.transform = 'scaleX(-1)';
            break;
        default:
            break;
    }
}

document.querySelector('#fontSize').addEventListener('input', (e) => {
    const fontSize = e.target.value + 'px';
    document.querySelector('#text').style.fontSize = fontSize;
    document.querySelector('#fontSizeValue').textContent = fontSize;
});

document.querySelector('#textColor').addEventListener('input', (e) => {
    document.querySelector('#text').style.color = e.target.value;
});

document.querySelector('#bold').addEventListener('change', (e) => {
    document.querySelector('#text').style.fontWeight = e.target.checked ? 'bold' : 'normal';
});

document.querySelector('#italic').addEventListener('change', (e) => {
    document.querySelector('#text').style.fontStyle = e.target.checked ? 'italic' : 'normal';
});

document.querySelector('#uppercase').addEventListener('change', (e) => {
    document.querySelector('#text').style.textTransform = e.target.checked ? 'uppercase' : 'none';
});
