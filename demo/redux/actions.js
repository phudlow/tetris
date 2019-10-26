export const boardChange = board => {
    return {
        type: 'BOARD_CHANGE',
        payload: board
    };
}

export const nextPiece = piece => {
    return {
        type: 'NEXT_PIECE',
        payload: piece
    };
}

export const gameStatusChange = status => {
    return {
        type: 'GAME_STATUS_CHANGE',
        payload: status
    };
}

export const rowFill = rows => {
    return {
        type: 'ROW_FILL',
        payload: rows
    };
}

export const showMainMenu = () => {
    return {
        type: 'SHOW_MAIN_MENU'
    };
}

export const newGame = () => {
    return {
        type: 'NEW_GAME'
    };
}
