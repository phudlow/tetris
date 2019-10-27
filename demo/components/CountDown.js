import React, { Component } from 'react';
import { TimelineLite } from 'gsap';
import styled from 'styled-components';

const Number = styled.div`
    color: orange;
    font-size: 3em;
`;

class CountDown extends Component {
    constructor(props) {
        super(props);
    }

    // Pulse animate each new number on countdown
    componentDidUpdate() {
        const countdown = document.getElementById('countdown');
        const tl = new TimelineLite();

        tl.to(countdown, 0.2, { "font-size": "6em" });
        tl.to(countdown, 0.2, { "font-size": "5em" });
    }
    render() {
        const number = this.props.countDown === 0 ? 'START!' : this.props.countDown;
        return (
            <Number id="countdown" hidden={this.props.countDown === null}>{number}</Number>
        );
    }
}

export default CountDown;
