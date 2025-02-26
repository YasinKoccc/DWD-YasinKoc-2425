const filters = document.querySelectorAll('.filter__tab');
const photos = document.querySelectorAll('figure');
const photoCount = document.querySelector('#numFound');
const viewIcons = document.querySelectorAll('.header__view a');
const gallery = document.querySelector('#gallery');

function filterPhotos(filter) {
    let count = 0;
    photos.forEach(photo => {
        const filters = photo.dataset.filters.split(' ');
        if (filter === 'alle' || filters.includes(filter)) {
            photo.style.display = 'block';
            count++;
        } else {
            photo.style.display = 'none';
        }
    });
    photoCount.innerHTML = count;
}

filters.forEach(filter => {
    filter.addEventListener('click', (e) => {
        e.preventDefault();
        filters.forEach(btn => btn.classList.remove('active'));
        filter.classList.add('active');
        const filterValue = filter.dataset.filter;
        filterPhotos(filterValue);
    });
});

viewIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        viewIcons.forEach(btn => btn.classList.remove('active'));
        icon.classList.add('active');
        const viewClass = icon.id === 'lnkViewGrid' ? 'grid' : 'list';
        gallery.className = viewClass;
    });
});

filterPhotos('alle');