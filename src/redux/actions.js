export const boardChange = board => {
    return {
        type: 'BOARD_CHANGE',
        payload: board
    }
}

export const gameStatusChange = status => {
    return {
        type: 'GAME_STATUS_CHANGE',
        payload: status
    }
}

export const scored = score => {
    return {
        type: 'SCORED',
        payload: score
    }
}
