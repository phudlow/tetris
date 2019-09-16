import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange, rowFill } from '../redux/actions';

import Board from './Board';
import Results from './Results';

import pieces from '../game/standardPieces';
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
            move: {
                'k': 'left',
                ';': 'right',
                'l': 'down',
                'r': 'rotate-clockwise',
                'e': 'rotate-counterclockwise'
            },
            'p': 'pause'
        };

        this.game = new Tetris(gameOptions);
        this.props.boardChange(this.game.currentBoard);
        this.game.on('boardchange', this.props.boardChange);
        this.game.on('end', this.props.gameStatusChange.bind(null, 'ended'));

        this.onKeyDown = this.onKeyDown.bind(this);
        this.restart = this.restart.bind(this);

        this.start();
    }
    onKeyDown(e) {
        const keybinds = this.keybinds;

        // Move the game piece
        const move = keybinds.move[e.key];
        move && this.game.movePiece(move);

        // Pause the game
        if (keybinds[e.key] === 'pause') {
            if (this.props.gameStatus === 'paused') {
                this.game.unpause();
                this.props.gameStatusChange('running');
            }
            else {
                this.game.pause();
                this.props.gameStatusChange('paused');
            }
        }
    }
    start() {
        this.game.start();
        this.props.gameStatusChange("running");
    }
    restart() {
        this.game.clear();
        this.props.gameStatusChange("cleared");
        this.start();
    }
    render() {
        return (
            <div tabIndex="0" onKeyDown={this.onKeyDown}>
                <Board />
                <Results restart={this.restart} />
                {/* highscores : save to local storage */}
                {/* score: score for current game, show this or highscores */}
                {/* logo */}
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
        gameStatusChange: status => dispatch(gameStatusChange(status)),
        rowFill: rows => dispatch(rowFill(rows)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
