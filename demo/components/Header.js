import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TimelineLite } from 'gsap';

import { showMainMenu } from '../redux/actions';

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

        const introAnimation = () => {
            const tl = new TimelineLite();

            // Animate TETRIS title: show => move right => flash color
            tl.to(tetrisTitle, 0.3, { opacity: 1 }); // 0.3
            tl.from(tetrisTitle, 0.3, { left: "-200px" }, "-=0.3"); // 0.3
            tl.to(tetrisTitle, 0.05, { color: "orange" }, "-=0.06"); // 0.29
            tl.to(tetrisTitle, 1.5, { color: "navy" }); // 1.79

            // Animate TETRIS title colon: Move colon from off-screen right into place
            tl.to(titleColon, 0.8, { left: 0, ease: 'linear' }, "-=1.8"); // 0.79

            // Animate SIRTET: Show and move letters sequentially into place from rotatinge 4 cardinal directions
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

            // Add one more arbitrary frame at the end, so we show the main menu after all the animations have completed
            tl.set(tetrisTitle, { opacity: 1, onComplete: this.props.showMainMenu });
        };

        // Small delay before animation begins
        setTimeout(introAnimation, 500);
    }
    render() {
        return (
            <header>
                <span id="tetris-title">TETRIS</span>
                <span id="title-colon">:</span>
                &nbsp;
                <span id="sirtet-title">
                    <span>R</span>
                    <span>U</span>
                    <span>S</span>
                    <span>H</span>
                    {/* <span>S</span>
                    <span>I</span>
                    <span>R</span>
                    <span>T</span>
                    <span>E</span>
                    <span>T</span> */}
                </span>
            </header>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showMainMenu: board => dispatch(showMainMenu()),
    };
}

export default connect(null, mapDispatchToProps)(Header);
