'use strict';

const nav = document.querySelector('.nav');
const box = document.querySelector('.box');
const logo = document.querySelector('.logo');
const menu = document.querySelector('.menu');
const coords = nav.getBoundingClientRect();

window.addEventListener('scroll', fixedMenu);
logo.addEventListener('click', scrollToTop);
menu.addEventListener('click', scrollToBox);

function fixedMenu() {
  if (pageYOffset >= coords.top) {
    box.style.paddingBottom = coords.height + 'px';
    nav.classList.add('fixed-nav');
  } else {
    box.style.paddingBottom = '';
    nav.classList.remove('fixed-nav');
  }
}

function scrollToTop(e) {
  e.preventDefault();
  scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function scrollToBox(e) {
    if(e.target.nodeName === this) return;
    e.preventDefault();
    if(e.target.nodeName === 'LI') {
        const a = e.target.firstElementChild;
        scrolling(a);
    }
    scrolling(e.target);

}

function scrolling(a) {
    const href = a.getAttribute('href');
    console.log(href);
    const box = document.querySelector(href);
    console.log(box);
    const top = box.getBoundingClientRect().top + pageYOffset - coords.height;
    scrollTo({
        top: top,
        behavior: 'smooth'
    })
}
