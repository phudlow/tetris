/**
 * @param {object} options
 * @param {number=18} options.height The height of the game board
 * @param {number=10} options.width The width of the game board
 * @param {object} options.pieces
 * @param {boolean[][]} options.pieces.layouts
 * Array of 2-d arrays of booleans describing the layout of all pieces at each of their rotations
 * @param {object} keybinds Object containing keybinds for all of the actions in the game: left, right, down, rotate
 */
export default class Tetris {
    constructor(options) {
        this.options = options;

        this.subscribers = {
            'boardchange': [],
            'rowfill': [],
            'end': [],
        };
        this.eventTypes = Object.keys(this.subscribers);

        this.initialize();
    }
    initialize() {
        const { height = 18, width = 10 } = this.options;

        this.placedBoard = this.generateNewBoard(height, width);
        this.currentBoard = this.generateNewBoard(height, width);
        this.emit('boardchange', this.currentBoard);

        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece(this.currentPiece.value - 1);
    }
    clear() {
        this.initialize();
    }
    start() {
        for (const event in this.subscribers) {
            if (!this.subscribers[event].length) {
                console.warn(`No subscriber to event "${event}" found.  Call the .on("${event}", <handerFn>) method on the Tetrix instance to add a hander for this event.`)
            }
        }
        this.movePiece();
        this.setTimer(this.options.gameSpeed);
    }
    setTimer(interval = 500) {
        this.timer = setInterval(this.movePiece.bind(this, 'down'), interval);
    }
    end() {
        this.emit('end');
        clearInterval(this.timer);
    }
    on(ev, fn) {

        if (!this.eventTypes.includes(ev)) {
            const types = Object.keys(this.subscribers).map(evt => ` "${evt}"`);
            throw new Error(`Cannot subscribe to "${ev}".  Event must be one of type:${types}`);
        }
        if (!fn) {
            throw new Error(`No function was provided to call on ${ev} event.`);
        }
        this.subscribers[ev].push(fn);
    }
    emit(event) {
        const args = Array.prototype.splice.call(arguments, 1);
        this.subscribers[event].forEach(fn => fn.call(null, ...args));
    }
    off(ev, fn) {
        if (!this.eventTypes.includes(ev)) {
            const types = Object.keys(this.subscribers).map(evt => ` "${evt}"`);
            throw new Error(`Cannot unsubscribe to "${ev}".  Event must be one of type:${types}`);
        }
        if (!fn) {
            console.warn(`All handlers subscribed to the ${ev} event have been removed since no reference to a current handler was passed.`);
            this.subscribers[ev] = [];
        }
        else {
            this.subscribers[ev] = this.subscribers.filter(sub => sub !== subscriber);
        }
    }

    /** @param {"left"|"right"|"down"|"rotate"} [dir] How to move the piece */
    movePiece(dir) {
        const newPiece = {
            ...this.currentPiece,
            position: [this.currentPiece.position[0], this.currentPiece.position[1]],
        };
        let newBoard = false;

        switch (dir) {
            case "left":
                newPiece.position[1]--;
                break;
            case "right":
                newPiece.position[1]++;
                break;
            case "down":
                newPiece.position[0]++;
                break;
            case "rotate":
                newPiece.rotation++;
                break;
            default:
                break;
        }

        newBoard = this.getUpdatedBoard(newPiece, this.placedBoard.map(row => row.slice()));

        if (!newBoard) {
            if (dir === "down") {
                this.placePiece();
            }
            return;
        }

        this.currentPiece = newPiece;
        this.currentBoard = newBoard;
        this.emit('boardchange', this.currentBoard);
    }
    getFullRows(board) {
        let fullRows = [];
        for (let rowIdx = board.length - 1; rowIdx >= 0; rowIdx--) {
            if (!board[rowIdx].includes(0)) {
                fullRows.push(rowIdx);
            }
        }
        return fullRows;
    }
    handleFullRows() {
        const fullRows = this.getFullRows(this.currentBoard);

        if (fullRows.length) {

            // Filter out full rows then shift empty row to top of board for every filtered row
            const newBoard = this.currentBoard.filter((row, idx) => !fullRows.includes(idx) );
            fullRows.forEach(() => newBoard.unshift((new Array(this.options.width).fill(0))) );

            this.currentBoard = newBoard;
            this.emit('fullrows', fullRows);
            this.emit('boardchange', this.currentBoard);
        }
    }
    placePiece() {
        this.handleFullRows();

        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece(this.currentPiece.value - 1);

        this.placedBoard = this.currentBoard;
        this.movePiece();
    }
    getRandomPiece(notIdx) {
        const pieces = this.options.pieces;
        let index = notIdx;

        // If notIdx passed, pick a different piece
        while (index === notIdx) {
            index = Math.floor(Math.random() * pieces.length);
        }
 
        return {
            value: index + 1,
            position: [0, 3],
            rotation: 0,
            layouts: pieces[index].layouts
        };
    }
    /** @return {board|false} Returns the board with currentPiece drawn or false if the new board would result in a collision */
    getUpdatedBoard(piece, board) {
        const { value, position, rotation } = piece;
        const [ row, col ] = position;
        const layout = piece.layouts[rotation % piece.layouts.length];
        const updatedBoard = this.placedBoard.map(row => row.slice());

        // Apply layout from bottom-left of layout first
        //     [C, D, E, F]
        //     [8, 9, A, B]
        //     [4, 5, 6, 7]
        // --> [0, 1, 2, 3]
        //
        // The position (row and col) represents where "C" in the diagram above is positioned on the board
        let placedBlock, pieceBlock;
        for (let rowIdx = 3; rowIdx >= 0; rowIdx--) {
            for (let colIdx = 0; colIdx < 4; colIdx++) {
                placedBlock = updatedBoard[row + rowIdx] && updatedBoard[row + rowIdx][col + colIdx];
                pieceBlock = layout[rowIdx][colIdx];

                if (pieceBlock) {

                    // Collision!
                    if (placedBlock || typeof placedBlock === 'undefined') {
                        if (row === 0 && col === 3) {
                            this.end();
                            return false;
                        }
                        return false;
                    }

                    // Put pieceBlock at empty space
                    else {
                        updatedBoard[row + rowIdx][col + colIdx] = value;
                    }
                }
            }
        }
        return updatedBoard;
    }
    generateNewBoard(height, width) {
        return (new Array(height)).fill((new Array(width)).fill(0));
    }
}
