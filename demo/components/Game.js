import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange, rowFill, nextPiece } from '../redux/actions';

import GameBoard from './GameBoard';
import CountDown from './CountDown';
import PiecePreviewBoard from './PiecePreviewBoard';
import ResultsModal from './ResultsModal';
import PausedModal from './PausedModal';

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
            countDown: null
        };

        this.keybinds = props.keybinds;

        this.game = new Tetris(gameOptions);

        this.game.on('boardchange', this.props.boardChange);
        this.game.on('nextpiece', this.props.nextPiece);
        this.game.on('end', this.props.gameStatusChange.bind(null, 'ended'));

        this.props.boardChange(this.game.currentBoard);
        this.props.nextPiece(this.game.nextPiece.layouts[0]);

        // Assign keybindings to body
        document.body.onkeydown = this.onKeyDown.bind(this);
        document.body.onkeyup   = this.onKeyUp.bind(this);

        this.restart = this.restart.bind(this);
        this.resume  = this.resume.bind(this);
    }
    componentDidMount() {
        this.start();
    }
    onKeyDown(e) {
        const action = this.keybinds[e.keyCode];

        if (action) {
            e.preventDefault();
        }

        // Drop the game piece
        if (action === 'drop') {
            if (this.game.isDropping === false) {
                this.game.setDropping(true);
            }
        }

        // Pause the game
        else if (action === 'pause') {
            if (!this.props.gameStatus) {
                return;
            }
            else if (this.props.gameStatus === 'paused') {
                this.resume();
            }
            else {
                this.pause();
            }
        }

        // Move the game piece
        else {
            action && this.game.movePiece(action);
        }
    }

    pause() {
        this.game.stop();
        this.props.gameStatusChange('paused');
    }

    resume() {
        this.game.start();
        this.props.gameStatusChange('running');
    }

    onKeyUp(e) {
        const action = this.keybinds[e.keyCode];

        // Stop the dropping of the piece, if it isn't hard dropping
        if (action === 'drop' && this.game.options.dropSpeed !== 0) {
            this.game.setDropping(false);
        }
    }

    // Start countdown, tracked in state.  When complete, begin game.
    start() {
        let countDown = 3;
        this.setState({ countDown });

        this.countDownTimer = setInterval(() => {
            countDown--;
            if (countDown < 0) {
                this.game.begin();
                this.props.gameStatusChange("running");
                countDown = null;
                clearInterval(this.countDownTimer);
                this.countDownTimer = null;
            }
            this.setState({ countDown });
        }, 1000);
    }
    restart() {
        this.game.clear();
        this.props.gameStatusChange("cleared");
        this.start();
    }
    render() {
        return (
            <div id="game" >
                <div>
                    <GameBoard countDown={this.state.countDown} />
                    <CountDown countDown={this.state.countDown} />
                </div>
                <div>
                    <div id="piece-preview-board-label">
                        Next piece:
                    </div>
                    <br/><br/>
                    <PiecePreviewBoard />
                </div>

                <ResultsModal restart={this.restart} />
                <PausedModal resume={this.resume} />
                {/* highscores : save to local storage */}
                {/* score: score for current game, show this or highscores */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const mapKeyCodesToActions = {};
    for (const action in state.options.keybinds) {
        mapKeyCodesToActions[state.options.keybinds[action]] = action;
    }
    return {
        keybinds: mapKeyCodesToActions,
        gameStatus: state.game.gameStatus,
        ui: state.ui
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
