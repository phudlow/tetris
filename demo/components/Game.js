import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange, rowFill } from '../redux/actions';

import BoardHTML from './BoardHTML';
import BoardCanvas from './BoardCanvas';
import Results from './Results';

import pieces from '../../standardPieces';
import Tetris from '../../Tetris';

class Game extends Component {
    constructor(props) {
        super(props);

        const gameOptions = {
            height: 18,
            width: 10,
            pieces
        };

        // Start the game once the images have been loaded and canvas mounted
        this.state = {
            readyState: 0
        };

        this.blocksImg = document.createElement('img');
        this.blocksImg.setAttribute('src', './static/block.png');
        this.blocksImg.onload = this.onImageLoaded.bind(this);

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

        this.onKeyDown     = this.onKeyDown.bind(this);
        this.restart       = this.restart.bind(this);
    }
    incrementReadyState() {
        const readyState = this.state.readyState + 1;
        this.setState({ readyState });
        if (readyState === 2) {
            this.start()
        }
    }
    componentDidMount() { this.incrementReadyState(); }
    onImageLoaded() { this.incrementReadyState(); }
    onKeyDown(e) {
        const keybinds = this.keybinds;

        // Move the game piece
        const move = keybinds.move[e.key];
        move && this.game.movePiece(move);

        // Pause the game
        if (keybinds[e.key] === 'pause') {
            if (this.props.gameStatus === 'paused') {
                this.game.start();
                this.props.gameStatusChange('running');
            }
            else {
                this.game.stop();
                this.props.gameStatusChange('paused');
            }
        }
    }
    start() {
        this.game.begin();
        this.props.gameStatusChange("running");
    }
    restart() {
        this.game.clear();
        this.props.gameStatusChange("cleared");
        this.start();
    }
    render() {
        let boardCanvas;
        if (this.state.readyState === 2) {
            boardCanvas = <BoardCanvas
                blocksImg={this.blocksImg}
            />;
        }

        return (
            <div tabIndex="0" onKeyDown={this.onKeyDown}>
                { boardCanvas }
                {/* <BoardHTML /> */}
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
