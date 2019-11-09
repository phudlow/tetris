import React, { Component } from 'react';
import { connect } from 'react-redux';

import MainMenu from './MainMenu';
import Game from './Game';
import Options from './Options';
// import HighScores from './HighScores';

class RenderController extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let activeComponent;

        switch (this.props.ui) {
            case "main menu":
                activeComponent = <MainMenu />
                break;
            case "game":
                activeComponent = <Game />
                break;
            case "options":
                activeComponent = <Options />
                break;
            case "high scores":
                // activeComponent = <HighScores />
                break;
        }

        return (
            <div id="render-controller">
                { activeComponent }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ui: state.ui
    };
}

export default connect(mapStateToProps)(RenderController);
