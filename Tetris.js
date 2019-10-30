/** Class that manages a Tetris game. */
class Tetris {

    /**
     * A 2-dimensional array describing a game board.  0 describes an empty space, while a positive integer is a filled space.
     * The value of the positive integer is determined by the originating piece.
     * @typedef {Number[][]} Tetris#board
     */

    /**
     * Object containing information about a game piece.
     * @typedef {Object} Tetris#piece
     * @property {Number[][][]} layouts Array containing 2-dimensional arrays describing the layouts of all rotations of a piece.
     * @property {Number} value Unique numerical value belonging to this type of game piece.
     * @property {Number[]} position The x and y position of the piece on the board.
     * @property {Number} rotation Number representing the current rotation of the piece.
     */

    /**
     * Object containing the updated board and whether or not there was a collision.
     * @private
     * @typedef {Object} Tetris#updatedBoardResult
     * @property {Tetris#board} board Returns the [board]{@link Tetris#board} with currentPiece drawn.
     * @property {Boolean} hasCollision True if the updated board resulted in a collision.
     */

    /**
     * @param {Object} options
     * @param {Number} [options.height=18] The height of the game board.
     * @param {Number} [options.width=10] The width of the game board.
     * @param {Tetris#piece[]} options.pieces
     * @param {Number} [options.gameSpeed=500] The speed of the game loop in milliseconds.
     * @param {Number} [options.dropSpeed] How fast the game piece falls when a drop is initiated.  If 0 is passed, pieces will "hard drop", falling instantly.
     */
    constructor(options) {
        options.gameSpeed = this.startingGameSpeed = options.gameSpeed || 750;
        options.dropSpeed = typeof options.dropSpeed === 'number' ? options.dropSpeed : this.options.gameSpeed / 10;

        /** @member {Object} options Object containing options for the game.  See Constructor */
        this.options = options;
        /** @member {Boolean} isDropping Whether or not the piece is in a dropping state. */
        this.isDropping = false;
        /** @member {Object} subscribers Object containgin current subscribers to events. */
        this.subscribers = {
            'boardchange': [],
            'rowfill': [],
            'end': [],
            'nextpiece': [],
        };

        this.eventTypes = Object.keys(this.subscribers);

        this.initialize();
    }

    /**
     * Clear the game board and get new pieces.
     * @private
     * @fires Tetris#boardchange
     */
    initialize() {
        const { height = 18, width = 10 } = this.options;

        this.options.gameSpeed = this.startingGameSpeed;

        this.placedBoard = this.generateNewBoard(height, width);
        this.currentBoard = this.generateNewBoard(height, width);
        this.emit('boardchange', this.currentBoard);

        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece(this.currentPiece.value - 1);
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /** Return the game to its original cleared state. */
    clear() {
        this.initialize();
    }

    /** Begin a newly initialized game and start the game timer. */
    begin() {
        for (const event in this.subscribers) {
            if (!this.subscribers[event].length) {
                console.warn(`No subscriber to event "${event}" found.  Call the .on("${event}", <handlerFn>) method on the Tetrix instance to add a hander for this event.`)
            }
        }
        this.setTimer(this.options.gameSpeed);
        this.emit('nextpiece', this.nextPiece.layouts[0]);
        this.movePiece();
    }

    /** End the game.  Used to implement win / loss conditions. */
    end() {
        this.emit('end');
        clearInterval(this.timer);
        this.timer = null;
    }

    /** Pause the game by stopping the game timer. */
    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    /** Resume the game by starting the game timer. */
    start() {
        if (this.timer) {
            console.warn('Tetris.start was called when the game timer is already running!');
        }
        this.setTimer(this.options.gameSpeed);
    }

    /**
     * Set the game timer.
     * @private
     * @param {Number} interval Speed of the game loop in milliseconds.
     */
    setTimer(interval) {
        this.stop();
        this.timer = setInterval(this.movePiece.bind(this, 'down'), interval);
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * Fires when there is a change in the board layout.
     * Views which implement the Tetris game board should redraw when this event is fired.
     * @event Tetris#boardchange
     * @type {Tetris#board}
     */

    /**
     * Fires when there is a change in the next piece.  Occurs when a piece is placed.
     * Views which implement next piece preview should redraw when this event is fired.
     * @event Tetris#nextpiece
     * @type {Tetris#board}
     */

    /**
     * Fires when the game ends.
     * @event Tetris#end
     */

    /**
     * Fires when any rows are filled, passing an array containing the indexes of the filled rows.
     * A subsequent [boardchange]{@link Tetris#boardchange} event is fired containing a [board]{@link Tetris#board} with the filled rows cleared.
     * @event Tetris#rowfill
     * @type {Number[]}
     */

    /**
     * Subscribe to a game event.
     * @param {String} event The name of the event.
     * @param {Function} fn The event handler.
     */
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

    /**
     * Unsubscribe to a game event.
     * If a reference to the event handler is not passed, all subscriptions to the event are removed.
     * @param {String} event The name of the event.
     * @param {Function} [fn] The event handler.
     */
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

    /**
     * Emit an event.
     * @private
     * @param {String} event The name of the event.
     */
    emit(event) {
        const args = Array.prototype.splice.call(arguments, 1);
        this.subscribers[event].forEach(fn => fn(...args));
    }

    // ---------------------------------------------------------------------------------------------------------------------

    /**
     * @param {Boolean} dropping True to make the current piece drop.  False to stop dropping on the current piece.
     */
    setDropping(dropping) {
        if (!this.timer) {
            return;
        }
        this.isDropping = dropping;
        this.setTimer(dropping ? this.options.dropSpeed : this.options.gameSpeed);
    }

    /**
     * Move the piece, then generate a new game board.
     * @param {"left"|"right"|"down"|"rotate-clockwise"|"rotate-counterclockwise"} [direction] How to move the piece
     * @fires Tetris#boardchange
     */
    movePiece(direction) {

        // Return if the game is not running
        if (!this.timer) {
            return;
        }

        // Don't do other movement while the piece is going down
        if (this.isDropping && direction !== "down" && typeof direction !== 'undefined') {
            return;
        }

        const newPiece = {
            ...this.currentPiece,
            position: [this.currentPiece.position[0], this.currentPiece.position[1]],
        };

        switch (direction) {
            case "left":
                newPiece.position[1]--;
                break;
            case "right":
                newPiece.position[1]++;
                break;
            case "down":
                newPiece.position[0]++;
                break;
            case "rotate-clockwise":
                newPiece.rotation++;
                break;
            case "rotate-counterclockwise":
                newPiece.rotation--;
                break;
            default:
                break;
        }

        const { board, hasCollision } = this.getUpdatedBoard(newPiece, this.placedBoard.map(row => row.slice()));

        if (hasCollision) {

            // If piece collided at starting position, Game Over
            if (newPiece.position[0] === 0 && newPiece.position[1] === 3) {
                this.end()
            }
            // Collided while going down, place piece
            else if (direction === "down") {
                this.placePiece();
                return;
            }
            // Collided otherwise, keep board the same
            else {
                return;
            }
        }

        this.currentPiece = newPiece;

        // Doing hard drop => Immediately move piece down until collision
        if (this.isDropping && this.options.gameSpeed === 0) {
            this.movePiece("down");
        }

        this.currentBoard = board;
        this.emit('boardchange', this.currentBoard);
    }

    /**
     * Determine the indexes of a [board]{@link Tetris#board} that contain full rows.
     * @private
     * @param {board} board
     * @return {Number[]} Indexes of the full rows.
     */
    getFullRows(board) {
        let fullRows = [];
        for (let rowIdx = board.length - 1; rowIdx >= 0; rowIdx--) {
            if (!board[rowIdx].includes(0)) {
                fullRows.push(rowIdx);
            }
        }
        return fullRows;
    }

    /**
     * Handle possible full rows on the board by clearing them and firing appropriate events.
     * @private
     * @fires Tetris#rowfill
     * @fires Tetris#boardchange
     */
    handleFullRows() {
        const fullRows = this.getFullRows(this.currentBoard);

        if (fullRows.length) {

            // Filter out full rows then shift empty row to top of board for every filtered row
            const newBoard = this.currentBoard.filter((row, idx) => !fullRows.includes(idx) );
            fullRows.forEach(() => newBoard.unshift((new Array(this.options.width).fill(0))) );

            this.currentBoard = newBoard;
            this.emit('rowfill', fullRows);
            this.emit('boardchange', this.currentBoard);
        }
    }

    /**
     * Called when a piece is set.  Handle full rows and get a new piece.
     * @private
     */
    placePiece() {
        this.setDropping(false);

        this.handleFullRows();

        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece(this.currentPiece.value - 1);
        this.emit('nextpiece', this.nextPiece.layouts[0]);

        this.placedBoard = this.currentBoard;

        this.movePiece();
    }

    /**
     * Get a random [piece]{@link Tetris#piece} from those defined in options.
     * @private
     * @param {Number} [notIdx] If notIdx passed, pick a different piece than the one at this index.
     * @returns {Tetris#piece}
     */
    getRandomPiece(notIdx) {
        const pieces = this.options.pieces;
        let index = notIdx;
        let layouts;

        // If notIdx passed, pick a different piece than the one at notIdx
        while (index === notIdx) {
            index = Math.floor(Math.random() * pieces.length);
        }
        layouts = pieces[index].layouts;

        return {
            value: index + 1,
            position: [0, Math.floor(this.options.width / 2) - Math.floor(layouts[0].length) / 2],
            rotation: 0,
            layouts: pieces[index].layouts
        };
    }

    /**
     * Draw a [piece]{@link Tetris#piece} onto a [board]{@link Tetris#board} containing only placed pieces.
     * If a collision occurs at the original piece position, end the game.
     * @private
     * @param {Tetris#piece} piece The current piece to be drawn on the board.
     * @param {Tetris#board} board Current board containing only placed pieces.
     * @return {Tetris#updatedBoardResult}
     */
    getUpdatedBoard(piece, board) {
        const { value, position, rotation } = piece;
        const [ row, col ] = position;
        const pieceIdx = (piece.layouts.length + rotation % piece.layouts.length) % piece.layouts.length;
        const layout = piece.layouts[pieceIdx];
        let hasCollision = false;

        // Apply layout from bottom-left of layout first:
        //           [C, D, E, F] <-- end
        //           [8, 9, A, B]
        //           [4, 5, 6, 7]
        // start --> [0, 1, 2, 3]
        //
        // The position (row and col) represents where "C" in the diagram above is positioned on the board
        let placedBlock, pieceBlock;
        for (let rowIdx = 3; rowIdx >= 0; rowIdx--) {
            for (let colIdx = 0; colIdx < 4; colIdx++) {
                placedBlock = board[row + rowIdx] && board[row + rowIdx][col + colIdx];
                pieceBlock = layout[rowIdx][colIdx];

                if (pieceBlock) {

                    // Collision! (with either a placed block or the border)
                    if (placedBlock || typeof placedBlock === 'undefined') {
                        hasCollision = true;
                    }

                    // Put pieceBlock at empty space
                    else {
                        board[row + rowIdx][col + colIdx] = value;
                    }
                }
            }
        }
        return { board, hasCollision };
    }

    /**
     * Generate a blank [board]{@link Tetris#board}.
     * @private
     * @param {Number} height
     * @param {Number} width
     */
    generateNewBoard(height, width) {
        return (new Array(height)).fill((new Array(width)).fill(0));
    }
}

export default Tetris;
