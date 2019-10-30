import React, { Component } from 'react';
import { connect } from 'react-redux';
import { boardChange, gameStatusChange, rowFill, nextPiece, nextLevel } from '../redux/actions';

import GameBoard from './GameBoard';
import CountDown from './CountDown';
import GameInfo from './GameInfo';
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
        this.keybinds = props.keybinds;
        this.timeBetweenLevels = 20;

        this.state = {
            gameStartCountDown: null,
            timeToNextLevel: this.timeBetweenLevels
        };

        this.game = new Tetris(gameOptions);

        this.game.on('boardchange', this.props.boardChange);
        this.game.on('nextpiece', this.props.nextPiece);
        this.game.on('end', this.end.bind(this));

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

    getNextLevelSpeed() {
        return this.game.options.gameSpeed * 0.75;
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

    begin() {
        this.startLevelTimer();
        this.game.begin();
        this.props.gameStatusChange("running");
    }

    // Set next level (speed increase) timer
    startLevelTimer() {
        this.timeToNextLevelTimer = setInterval(() => {
            let newValue = this.state.timeToNextLevel - 1;
            if (newValue === -1) {
                newValue = this.timeBetweenLevels;
                this.game.options.gameSpeed = this.getNextLevelSpeed();
                this.props.nextLevel();
            }
            this.setState({
                timeToNextLevel: newValue === -1 ? this.timeBetweenLevels : newValue
            });
        }, 1000);
    }

    stopLevelTimer() {
        clearInterval(this.timeToNextLevelTimer);
        this.timeToNextLevelTimer = null;
    }

    pause() {
        this.stopLevelTimer();
        this.game.stop();
        this.props.gameStatusChange('paused');
    }

    resume() {
        this.startLevelTimer();
        this.game.start();
        this.props.gameStatusChange('running');
    }

    end() {
        this.stopLevelTimer();
        this.props.gameStatusChange('ended');
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
        let gameStartCountDown = 3;
        this.setState({ gameStartCountDown });

        this.gameStartCountDownTimer = setInterval(() => {
            gameStartCountDown--;
            if (gameStartCountDown < 0) {
                this.begin();
                gameStartCountDown = null;
                clearInterval(this.gameStartCountDownTimer);
                this.gameStartCountDownTimer = null;
            }
            this.setState({ gameStartCountDown });
        }, 1000);
    }
    restart() {
        this.game.clear();
        this.props.gameStatusChange("cleared");
        this.start();
    }
    render() {
        return (
            <div id="game">
                <div>
                    <GameBoard/>
                    <CountDown countDown={this.state. gameStartCountDown} />
                </div>
                <div className="right-container">
                    <GameInfo timeToNextLevel={this.state.timeToNextLevel} />
                    <div className="piece-preview">
                        Next piece:
                        <br/><br/>
                        <div id="piece-preview-board">
                            <PiecePreviewBoard />
                        </div>
                    </div>
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
        nextLevel: () => dispatch(nextLevel())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
