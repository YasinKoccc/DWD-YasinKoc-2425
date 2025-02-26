const filters = document.querySelectorAll('.filter');
const image = document.querySelector('img');
const opacitySlider = document.querySelector('input[type="range"]');
const opacityLabel = document.querySelector('#slider-label span:last-child');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(btn => btn.classList.remove('actief'));
        filter.classList.add('actief');

        image.classList.remove('grayscale', 'sepia', 'hue', 'blur', 'invert');

        const filterMap = {
            "grayscale": "grayscale",
            "sepia": "sepia",
            "hue": "hue",
            "blur": "blur",
            "invert": "invert"
        };

        const filterNaam = filter.innerHTML.toLowerCase();
        const cssClass = filterMap[filterNaam] || "";
        if (cssClass) {
            image.classList.add(cssClass);
        }

        image.style.opacity = opacitySlider.value;
    });
});

opacitySlider.addEventListener('input', () => {
    image.style.opacity = opacitySlider.value;
    opacityLabel.textContent = `${Math.round(opacitySlider.value * 100)}%`;
});
