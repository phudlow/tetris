import { createStore, /*combineReducers*/ compose } from 'redux';
import reducer from './reducer';

const initialStore = {
    game: {
        board: null,
        nextPiece: null,
        score: 0,
        rows: 0,
        level: 1,

        // "running": game is running with interval timer
        // "paused": an active game's timer is inactive
        // "ended": the game has just ended
        // <null>: no game is running
        gameStatus: null,
    },
    ui: null,
    options: {
        keybinds: {
            "left": 37,
            "drop": 40,
            "right": 39,
            "rotate-counterclockwise": 69,
            "rotate-clockwise": 82,
            "pause": 32
        }
    },
    highScores: []
}
const store = createStore(reducer, initialStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
