import { createStore, /*combineReducers*/ compose } from 'redux';
import reducer from './reducer';

const initialStore = {
    board: null,
    score: 0,
    rows: 0,
    level: 1,
    count: 0,

    // "running": game is running with interval timer
    // "paused": an active game's timer is inactive
    // "ended": the game has just ended
    // <null>: no game is running
    gameStatus: null
}
const store = createStore(reducer, initialStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
