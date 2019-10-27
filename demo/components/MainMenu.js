import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newGame, showOptions } from '../redux/actions';
import { TimelineLite } from 'gsap';

import Button from './Button';

class MainMenu extends Component {
    constructor(props) {
        super(props);
    }
    // Animate each button into view
    componentDidMount() {
        const buttons = document.getElementById('main-menu').querySelectorAll('div');
        const tl = new TimelineLite();

        buttons.forEach((button, idx) => {
            tl.fromTo(button, 0.2, { top: "10px" }, { opacity: 1, top: "0" }, 0.05 + idx * 0.05);
        });
    }
    render() {
        return (
            <div id="main-menu">
                <Button onClick={this.props.newGame}>New Game</Button>
                <br/>
                <Button onClick={this.props.showOptions}>Options</Button>
                <br/>
                <Button onClick={this.props.newGame}>High Scores</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        options: state.options
    };
}

const mapDispatchToProps = dispatch => {
    return {
        newGame: () => dispatch(newGame()),
        showOptions: () => dispatch(showOptions())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
