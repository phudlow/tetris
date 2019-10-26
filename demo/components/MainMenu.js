import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newGame } from '../redux/actions';
import { TimelineLite } from 'gsap';

import Button from '@material-ui/core/Button';

class MainMenu extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const mainMenu = document.getElementById('main-menu');
        const tl = new TimelineLite();
        tl.fromTo(mainMenu, 0.5, { top: "10px" }, { opacity: 1, top: "0px" });
    }
    render() {
        return (
            <div id="main-menu">
                <Button variant="contained" color="primary" onClick={this.props.newGame}>New Game</Button>
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
        newGame: board => dispatch(newGame())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
