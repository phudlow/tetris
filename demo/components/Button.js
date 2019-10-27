import React, { Component } from 'react';
import styled from 'styled-components';
import { TimelineLite } from 'gsap';

// Slides behind button on hover
const ButtonBackground = styled.div`
    position: absolute;
    display: inline-block;
    top: 0;
    height: 100%;
    width: 300%;
    left: -300%;
    z-index: -1;
    background: linear-gradient(135deg, #eee, #eee 60%, yellow 60%, yellow 77%, white 77%, white);
`;

const ButtonStyled = styled.div`
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-family: Captain-Canaveral;
    padding: 10px;
    font-size: 2.5em;
    overflow: hidden;
`;

class Button extends Component {
    constructor(props) {
        super(props);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }
    // Slide background behind button and add pulsing button glow
    onMouseOver(e) {
        const btn = e.target;
        const background = btn.querySelector('div');
        const tl = new TimelineLite();

        tl.to(background, 0.2, {
            left: "0",
            ease: "linear",
            onComplete: () => {
                btn.classList.add('btn-hover');
            }
        });
    }
    // Set button to default state
    onMouseLeave(e) {
        const btn = e.target;
        const background = btn.querySelector('div');
        const tl = new TimelineLite();

        tl.set(background, { left: "-300%" });
        btn.classList.remove('btn-hover');
    }
    render() {
        return (
            <ButtonStyled
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                onClick={this.props.onClick}
            >
                <ButtonBackground />
                {this.props.children}
            </ButtonStyled>
        );
    }
}

export default Button;
