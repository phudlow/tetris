import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange, rowFill, nextPiece } from '../redux/actions';

import Header from './Header';
import GameBoard from './GameBoard';
import PiecePreviewBoard from './PiecePreviewBoard';
import Results from './Results';

import pieces from '../../standardPieces';
import Tetris from '../../Tetris';

class Game extends Component {
    constructor(props) {
        super(props);

        const gameOptions = {
            height: 18,
            width: 10,
            dropSpeed: 0,
            pieces
        };

        // Start the game once the images have been loaded and canvas mounted
        this.state = {
            blocksLoaded: false
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

        this.game.on('boardchange', this.props.boardChange);
        this.game.on('nextpiece', this.props.nextPiece);
        this.game.on('end', this.props.gameStatusChange.bind(null, 'ended'));

        this.props.boardChange(this.game.currentBoard);
        this.props.nextPiece(this.game.nextPiece.layouts[0]);

        // Assign keybindings to body
        document.body.onkeydown = this.onKeyDown.bind(this);
        document.body.onkeyup   = this.onKeyUp.bind(this);

        this.restart   = this.restart.bind(this);
    }
    onImageLoaded() {
        this.setState({ blocksLoaded: true });
        this.start();
    }
    onKeyDown(e) {
        const keybinds = this.keybinds;

        // Move the game piece
        const move = keybinds.move[e.key];
        if (move === 'down') {
            if (this.game.isDropping === false) {
                this.game.setDropping(true);
            }
        }
        else {
            move && this.game.movePiece(move);
        }

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
    onKeyUp(e) {
        const move = this.keybinds.move[e.key];
        if (move === 'down') {
            this.game.setDropping(false);
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
        let gameBoard, piecePreviewBoard;

        if (this.state.blocksLoaded) {
            gameBoard = <GameBoard blocksImg={this.blocksImg} />;
            piecePreviewBoard = <PiecePreviewBoard blocksImg={this.blocksImg} />;
        }

        return (
            <div id="game" >
                <Header />
                { gameBoard }
                <span>
                    Next piece:
                    <br/>
                    { piecePreviewBoard }
                </span>
                <Results restart={this.restart} />
                {/* <PiecePreview piece={this.} /> */}
                {/* highscores : save to local storage */}
                {/* score: score for current game, show this or highscores */}
                {/* logo */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameStatus: state.game.gameStatus
    };
}

const mapDispatchToProps = dispatch => {
    return {
        boardChange: board => dispatch(boardChange(board)),
        gameStatusChange: status => dispatch(gameStatusChange(status)),
        rowFill: rows => dispatch(rowFill(rows)),
        nextPiece: piece => dispatch(nextPiece(piece)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
