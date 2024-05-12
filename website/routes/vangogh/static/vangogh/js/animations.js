
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = function(div, speed = 100, offset = 0) {
        const scrollPercent = window.scrollY - div.offsetTop;
        return (scrollPercent + offset) / speed;
    };

    const number = anime({
        targets: '#anime-number',
        innerHTML: [0, 2000],
        easing: 'linear',
        round: 1
    });

    const sep = document.getElementById('biographie');

    anime({
        targets: '#img-1',
        translateX: -400,
        duration: 0,
    });

    const animation1 = anime({
        targets: '#img-1',
        translateX: 0,
        duration: 4000,
        autoplay: false,
        easing: 'easeInOutExpo'
    });

    const img1 = document.getElementById('accueil');

    anime({
        targets: '#anime-box',
        translateX: -window.screen.width,
        duration: 0,
    });

    const animation2 = anime({
        targets: '#anime-box',
        translateX: 0,
        duration: 4000,
        autoplay: false,
        easing: 'easeInOutExpo'
    });

    const part1 = document.getElementById('part-1');

    anime({
        targets: '#anime-img-large-2',
        translateX: -(window.screen.width/2),
        duration: 0,
    });

    const animation3 = anime({
        targets: '#anime-img-large-2',
        translateX: 0,
        duration: 4000,
        autoplay: false,
        easing: 'easeInOutExpo'
    });

    const part2 = document.getElementById('part-2');

    window.onscroll = function() {
        number.seek(animateOnScroll(sep, 100) * number.duration);
        animation1.seek(animateOnScroll(img1, 1000, -400) * animation1.duration);
        animation2.seek(animateOnScroll(part1, 1000) * animation2.duration);
        animation3.seek(animateOnScroll(part2, 800) * animation3.duration);
    };
});
