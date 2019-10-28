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
    background: linear-gradient(90deg, #eee, #eee 60%, yellow 60%, yellow 77%, white 77%, white);
`;

const ButtonStyled = styled.div`
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-family: Captain-Canaveral;
    padding: 10px;
    overflow: hidden;
`;

class Button extends Component {
    constructor(props) {
        super(props);

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }
    // Slide background behind button and add pulsing button glow
    onMouseEnter(e) {
        const btn = e.currentTarget;
        const background = btn.querySelector('div:first-child');
        const tl = new TimelineLite();

        tl.to(background, 0.2, {
            left: "0",
            ease: "linear",
            onComplete: () => {
                btn.classList.add('pulse-text');
            }
        });
    }
    // Set button to default state
    onMouseLeave(e) {
        const btn = e.currentTarget;
        const background = btn.querySelector('div:first-child');
        const tl = new TimelineLite();

        tl.set(background, { left: "-300%" });
        btn.classList.remove('pulse-text');
    }
    render() {
        return (
            <ButtonStyled
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.props.onClick}
            >
                {/* Animated button background */}
                <ButtonBackground />

                {/* Also absolute position, to appear above the absolute positioned ButtonBackground */}
                <div style={{position: "absolute"}}>{this.props.children}</div>

                {/* Invisible, to take up space for proper dimensions */}
                <div style={{color: 'transparent'}}>{this.props.children}</div>
            </ButtonStyled>
        );
    }
}

export default Button;
