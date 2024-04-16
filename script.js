'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const message = document.createElement('div');
const navItemScroll = document.querySelectorAll('.nav__link');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const operationsBtn = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slideBtnLeft = document.querySelector('.slider__btn--left');
const slideBtnRight = document.querySelector('.slider__btn--right');
const dotsParent = document.querySelector('.dots');
let currentSlide = 0;

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

// change opacity of nav elements on hover
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(sibling => {
            if (sibling !== link) {
                sibling.style.opacity = this;
            }
            logo.style.opacity = this;
        });
    }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky nav on scroll
const stickyNav = function (entries) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });
};
const observerOptions = {
    root: null,
    threshold: 0,
};
const observer = new IntersectionObserver(stickyNav, observerOptions);
observer.observe(header);

// reveal sections on scroll
const revealSection = function (entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
        entry.target.classList.remove('section--hidden');
        if (entry.target.getAttribute('id') === 'section--3') {
            startInterval();
        }
    } else {
        return;
    }
};
const sectionObserverOptions = {
    root: null,
    threshold: 0.1,
};
const sectionObserver = new IntersectionObserver(
    revealSection,
    sectionObserverOptions
);
sections.forEach(section => {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
});

// auto-scroll reviews
let reviewScrolling;
const startInterval = function () {
    reviewScrolling = setInterval(() => {
        if (currentSlide === 2) {
            currentSlide = 0;
        } else {
            currentSlide += 1;
        }
        changeSlide();
    }, 5000);
};

// load images on scroll
const loadImg = function (entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
        entry.target.setAttribute(
            'src',
            `${entry.target.getAttribute('data-src')}`
        );
        entry.target.classList.remove('lazy-img');
    } else {
        return;
    }
};
const imgObsOptions = {
    root: null,
    threshold: 0.1,
};
const imgObserver = new IntersectionObserver(loadImg, imgObsOptions);
imgTargets.forEach(image => {
    imgObserver.observe(image);
});

// create slider and dots
slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * i}%)`;
    dotsParent.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
    );
});

// change slide
const changeSlide = function () {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    changeActiveDot();
};

// check for the next slide
const nextSlide = function () {
    if (currentSlide >= slides.length - 1) {
        currentSlide = 0;
    } else {
        currentSlide += 1;
    }
    changeSlide();
};
// check for the previous slide
const previousSlide = function () {
    if (currentSlide <= 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide -= 1;
    }
    changeSlide();
};

// change active dot
const changeActiveDot = function () {
    document.querySelectorAll('.dots__dot').forEach(dot => {
        dot.classList.remove('dots__dot--active');
    });

    document
        .querySelector(`.dots__dot[data-slide="${currentSlide}"`)
        .classList.add('dots__dot--active');
};

// init
changeSlide();

btnsOpenModal.forEach(button => {
    button.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// button scroll
navItemScroll.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(`${this.getAttribute('href')}`);
        const coords = section.getBoundingClientRect();
        window.scrollTo({
            left: coords.left + window.scrollX,
            top: coords.top + window.scrollY,
            behavior: 'smooth',
        });
    });
});

// learn more scroll
btnScrollTo.addEventListener('click', function (e) {
    e.preventDefault();
    // only for newer versions of browsers
    section1.scrollIntoView({ behavior: 'smooth' });
});

// change active info tab
operationsBtn.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        operationsBtn.forEach(button => {
            button.classList.remove('operations__tab--active');
        });
        operationsContent.forEach(content => {
            content.classList.remove('operations__content--active');
        });

        const markBtn = document.querySelector(`.${this.classList[2]}`);
        const markContent = document.querySelector(
            `.operations__content--${
                this.classList[2][this.classList[2].length - 1]
            }`
        );

        markBtn.classList.add('operations__tab--active');
        markContent.classList.add('operations__content--active');
    });
});

// change slides based on button press
slideBtnRight.addEventListener('click', nextSlide);
slideBtnLeft.addEventListener('click', previousSlide);
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        previousSlide();
    }
});

// change slides based on arrow keys
dotsParent.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
        const slide = e.target.dataset.slide;
        currentSlide = slide;
        changeSlide();
    }
});

// remove setinterval() on mouse hover
// aka continuing auto-scroll reviews (if you're trying to look it up with ctrl+f)
slides.forEach(slide => {
    slide.addEventListener('mouseover', function () {
        clearInterval(reviewScrolling);
    });
});

// start setinterval() on mouse out
// aka continuing auto-scroll reviews (if you're trying to look it up with ctrl+f)
slides.forEach(slide => {
    slide.addEventListener('mouseout', startInterval);
});

// items from course
document.addEventListener('DOMContentLoaded', function (e) {
    console.log(e);
});

window.addEventListener('load', e => {
    console.log(e);
});
