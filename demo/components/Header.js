import React, { Component } from 'react';

import { TimelineLite } from 'gsap';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    // Do title intro animation
    componentDidMount() {
        const tetrisTitle = document.getElementById('tetris-title');
        const titleColon = document.getElementById('title-colon');
        const sirtetLetters = document.getElementById('sirtet-title').querySelectorAll('span');
        const letterAnimationTime = 0.05;
        const letterOffset = "100px";
        const tl = new TimelineLite();

        const anim = () => {
            tl.to(tetrisTitle, 0.3, { opacity: 1 }); // 0.3
            tl.from(tetrisTitle, 0.3, { left: "-200px" }, "-=0.3"); // 0.3
            tl.to(tetrisTitle, 0.05, { color: "orange" }, "-=0.06"); // 0.29
            tl.to(tetrisTitle, 1.5, { color: "navy" }); // 1.79
            tl.to(titleColon, 0.8, { left: 0, ease: 'linear' }, "-=1.8"); // 0.79

            sirtetLetters.forEach((letter, idx) => {
                const timeOffset = 1.1 + idx * 0.1;
                tl.to(letter, letterAnimationTime, { opacity: 1 }, timeOffset);
                switch (idx % 4) {
                    case 0:
                        tl.from(letter, letterAnimationTime, { bottom: letterOffset }, timeOffset);
                        break;
                    case 1:
                        tl.from(letter, letterAnimationTime, { left: letterOffset }, timeOffset);
                        break;
                    case 2:
                        tl.from(letter, letterAnimationTime, { top: letterOffset }, timeOffset);
                        break;
                    case 3:
                        tl.from(letter, letterAnimationTime, { right: letterOffset }, timeOffset);
                        break;
                }
            });
        };

        // Small delay before animation begins
        setTimeout(anim, 500);
    }
    render() {
        return (
            <header>
                <span id="tetris-title">TETRIS</span>
                <span id="title-colon">:</span>
                &nbsp;
                <span id="sirtet-title">
                    <span>S</span>
                    <span>I</span>
                    <span>R</span>
                    <span>T</span>
                    <span>E</span>
                    <span>T</span>
                </span>
            </header>
        );
    }
}

export default Header;
