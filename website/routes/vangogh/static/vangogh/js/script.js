document.addEventListener('DOMContentLoaded', () => {
    const carrousel = document.querySelector('.part__carrousel__item');
    const carrouselArrows = document.querySelectorAll('.part__carrousel__item .arrows button');
    const carrouselInfo = document.getElementById('carrousel-info');
    const carrouselInfoLegends = carrouselInfo.querySelectorAll('p');
    const carrouselDescriptions = document.querySelectorAll('.part__container__unique__item');

    let buttons = Array.from(carrouselArrows);
    buttons.push(...document.querySelectorAll('.legend .arrows button'));

    let carrouselIndex = 1;
    let pair = 0;
    buttons.forEach((button) => {
        if (pair === 0) {
            pair = 1;
        
            button.addEventListener('click', () => {
                carrouselIndex -= 1;
                if (carrouselIndex < 1) {
                    carrouselIndex = carrouselInfoLegends.length;
                }
    
                updateCarrousel(carrouselIndex);
            });
        } else {
            pair = 0;

            button.addEventListener('click', () => {
                carrouselIndex += 1;
                if (carrouselIndex > carrouselInfoLegends.length) {
                    carrouselIndex = 1;
                }
    
                updateCarrousel(carrouselIndex);
            });
        }
    });

    function hideAllInfo() {
        carrouselInfoLegends.forEach((p) => {
            if (!p.classList.contains('hidden')) {
                p.classList.add('hidden');
            }
        });

        carrouselDescriptions.forEach((p) => {
            if (!p.classList.contains('hidden')) {
                p.classList.add('hidden');
            }
        });
    };

    function updateCarrousel(index) {
        carrousel.style.backgroundImage = `url('static/vangogh/vangogh/img/paintings/carrousel-${index}.png')`;

        hideAllInfo();
        carrouselInfoLegends[index - 1].classList.remove('hidden');
        carrouselDescriptions[index - 1].classList.remove('hidden');
    };

    updateCarrousel(carrouselIndex);

    /**
    setInterval(() => {
        carrouselIndex += 1;
        if (carrouselIndex > carrouselInfoLegends.length) {
            carrouselIndex = 1;
        }

        updateCarrousel(carrouselIndex);
    }, 5000);
    **/

    // After the page loads, preload all images
    for (let i = 1; i <= carrouselInfoLegends.length; i++) {
        const img = new Image();
        img.src = `https://bayfield.dev/static/vangogh/vangogh/img/paintings/carrousel-${i}.png`;
    }
});
