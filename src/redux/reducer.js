import store from "./store";

function reducer(state, action) {
    switch (action.type) {
        case 'BOARD_CHANGE':
            return {
                ...state,
                board: action.payload
            }
        case 'GAME_STATUS_CHANGE':
            return {
                ...state,
                gameStatus: action.payload
            }
        case 'SCORE_CHANGE':
            return {
                ...state,
                score: state.score + action.payload
            }
    }
    return state;
}

export default reducer;
