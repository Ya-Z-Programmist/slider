'use strict';

import { Timer } from "./timer";

class Slider {

    constructor( options ) {
        this.isAnimationEnd = true;
        this.selectors = {
            wrap: document.querySelector(options.wrap),
            slides: document.querySelector(options.wrap).children,
            prevArrow: document.querySelector(options.prevArrow),
            nextArrow: document.querySelector(options.nextArrow)
        };
        this.default = {
            'autoplay': true,
            'autoplayDelay': 3000,
            'touch': true,
            'pauseOnFocus': true,
            'pauseOnHover': true
        };
        this.settings = Object.assign( this.default, options );
        this.position = 0;
        this.maxPosition = this.selectors.slides.length;
        this.timer;
        this.nextSlide = this.nextSlide.bind(this);
    }

    prevSlide() {

        if( !this.isAnimationEnd ) {
            return;
        }
        this.isAnimationEnd = false;

        --this.position;

        if( this.position < 0 ) {
            this.selectors.wrap.classList.add('s-notransition');
            this.selectors.wrap.style['transform'] = `translateX(-${this.maxPosition}00%)`;
            this.position = this.maxPosition - 1;
        }

        setTimeout( () => {
            this.selectors.wrap.classList.remove('s-notransition');
            this.selectors.wrap.style['transform'] = `translateX(-${this.position}00%)`;
        }, 10);

        this.selectors.wrap.addEventListener('transitionend', () => {
            this.isAnimationEnd = true;
        });
    }

    nextSlide() {

        if( !this.isAnimationEnd ) {
            return;
        }
        this.isAnimationEnd = false;

        if( this.position < this.maxPosition ) {
            ++this.position;
        }

        this.selectors.wrap.classList.remove('s-notransition');
        this.selectors.wrap.style['transform'] = `translateX(-${this.position}00%)`;

        this.selectors.wrap.addEventListener('transitionend', () => {
            if( this.position >= this.maxPosition ) {
                this.selectors.wrap.style['transform'] = 'translateX(0)';
                this.selectors.wrap.classList.add('s-notransition');
                this.position = 0;
            }

            this.isAnimationEnd = true;
        });

    }

    // create switch arrows
    createArrows() {
        if( !this.selectors.prevArrow || !this.selectors.nextArrow ) {

            const prevArr = document.createElement('a');
            prevArr.className = 'prev';
            prevArr.setAttribute('id', 'prev');
            prevArr.innerHTML = '&#10094;';
            this.selectors.prevArrow = prevArr;

            const nextArr = document.createElement('a');
            nextArr.className = 'next';
            nextArr.setAttribute('id', 'next');
            nextArr.innerHTML = '&#10095;';
            this.selectors.nextArrow = nextArr;

            this.selectors.wrap.append(this.selectors.nextArrow, this.selectors.prevArrow);
        }
    }

    build() {
        if( this.settings.autoplay === true ) {
            this.timer = new Timer( this.nextSlide, this.settings.autoplayDelay );
            this.timer.begin();
        }
        this.selectors.prevArrow.addEventListener('click', () => {
            this.prevSlide();
        });
        this.selectors.nextArrow.addEventListener('click', () => {
            this.nextSlide();
        });

        if( this.settings.autoplay && this.settings.pauseOnHover ) {
            this.selectors.wrap.addEventListener('mouseenter', () => {
                this.timer.pause();
            });

            this.selectors.wrap.addEventListener('mouseleave', () => {
               this.timer.become();
            })
        }
    }

    init() {
        this.selectors.wrap.appendChild(this.selectors.wrap.children[0].cloneNode(true));
        this.build();
        this.createArrows();
    }

}

export { Slider };
