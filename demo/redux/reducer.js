function reducer(state, action) {
    switch (action.type) {
        case 'BOARD_CHANGE':
            return {
                ...state,
                game: {
                    ...state.game,
                    board: action.payload
                }
            }
        case 'NEXT_PIECE':
            return {
                ...state,
                game: {
                    ...state.game,
                    nextPiece: action.payload
                }
            }
        case 'GAME_STATUS_CHANGE':
            const newState = {
                ...state,
                game: {
                    ...state.game,
                    gameStatus: action.payload
                }
            };
            if (action.payload === 'cleared') {
                Object.assign(newState.game, {
                    rows: 0,
                    score: 0,
                    level: 1,
                });
            }
            return newState;
        case 'ROW_FILL':
            return {
                ...state,
                rows: state.rows + action.payload
            }
        case 'SHOW_MAIN_MENU':
            return {
                ...state,
                ui: 'main menu'
            }
        case 'NEW_GAME':
            return {
                ...state,
                ui: 'game',
                game: {
                    board: null,
                    nextPiece: null,
                    score: 0,
                    rows: 0,
                    level: 1,
                    gameStatus: null
                }
            }
    }
    return state;
}

export default reducer;
