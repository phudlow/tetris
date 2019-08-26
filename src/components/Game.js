import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange } from '../redux/actions';

import Board from './Board';
import Results from './Results';

import pieces from '../game/pieces';
import Tetris from '../game/Tetris';

class Game extends Component {
    constructor(props) {
        super(props);

        const gameOptions = {
            height: 18,
            width: 10,
            pieces
        };

        this.keybinds = {
            'k': 'left',
            ';': 'right',
            'l': 'down',
            'r': 'rotate'
        };

        this.game = new Tetris(gameOptions);
        this.props.boardChange(this.game.currentBoard);
        this.game.on('boardchange', this.props.boardChange);
        this.game.on('end', this.props.gameStatusChange.bind(null, 'ended'));
        this.game.start();

        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(e) {
        const move = this.keybinds[e.key];
        move && this.game.movePiece(move);
    }
    render() {

        return (
            <div tabIndex="0" onKeyDown={this.onKeyDown}>
                <Board />
                <Results />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameStatus: state.gameStatus
    };
}

const mapDispatchToProps = dispatch => {
    return {
        boardChange: board => dispatch(boardChange(board)),
        gameStatusChange: status => dispatch(gameStatusChange(status))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
