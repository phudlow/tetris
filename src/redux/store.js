import { createStore, /*combineReducers*/ } from 'redux';
import reducer from './reducer';

const initialStore = {
    board: null,
    score: 0,
    gameStatus: null
}
const store = createStore(reducer, initialStore);

export default store;
