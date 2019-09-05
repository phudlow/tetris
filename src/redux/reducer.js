function reducer(state, action) {
    switch (action.type) {
        case 'BOARD_CHANGE':
            return {
                ...state,
                board: action.payload
            }
        case 'GAME_STATUS_CHANGE':
            const newState = {
                ...state,
                gameStatus: action.payload
            };
            if (action.payload === 'cleared') {
                Object.assign(newState, {
                    rows: 0,
                    score: 0,
                    level: 1,
                });
            }
            return newState;
        case 'ROW_FILL':
            return {
                ...state,
                rows: state.score + action.payload
            }
    }
    return state;
}

export default reducer;
