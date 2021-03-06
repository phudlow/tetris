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
        case 'NEXT_LEVEL':
            return {
                ...state,
                game: {
                    ...state.game,
                    level: ++state.game.level
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
            const score = [40, 100, 300, 1200][action.payload.length - 1]
            return {
                ...state,
                game: {
                    ...state.game,
                    rows: state.game.rows + action.payload.length,
                    score: state.game.score + score
                }
            }
        case 'SHOW_MAIN_MENU':
            return {
                ...state,
                ui: 'main menu'
            }
        case 'SHOW_OPTIONS':
            return {
                ...state,
                ui: 'options'
            }
        case 'NEW_OPTIONS':
            return {
                ...state,
                options: {
                    ...state.options,
                    ...action.payload,
                    keybinds: {
                        ...state.options.keybinds,
                        ...action.payload.keybinds
                    }
                }
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
