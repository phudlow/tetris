import React, { Component } from 'react';

import blocksImg from '../static/block.png';

const blocksImgElement = document.createElement('img');
blocksImgElement.setAttribute('src', blocksImg);

class Board extends Component {
    constructor(props) {
        super(props);

        const board = props.board;

        this.blockSize   = 30;
        this.boardHeight = board.length;
        this.boardWidth  = board[0].length;

        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.updateBoard(null, this.props.board);
    }

    shouldComponentUpdate(nextProps) {
        this.updateBoard(this.props.board, nextProps.board);

        // We don't want to rerender the canvas when new props arrive, just draw on current canvas
        return false;
    }

    updateBoard(currBoard, nextBoard) {
        const ctx = this.canvas.current.getContext('2d');
        const blockSize = this.blockSize;
        const blocks    = blocksImgElement;
        let currValue, nextValue;

        for (let i = 0, numRows = nextBoard.length; i < numRows; i++) {
            for (let j = 0, numCols = nextBoard[i].length; j < numCols; j++) {
                currValue = currBoard && currBoard[i][j];
                nextValue = nextBoard && nextBoard[i][j];

                if (currValue !== nextValue) {
                    if (nextValue) {
                        ctx.drawImage(
                            blocks,                       // image element
                            (nextValue - 1) * blockSize,  // sx
                            0,                            // sy
                            blockSize,                    // sWidth
                            blockSize,                    // sHeight
                            j * blockSize,                // dx
                            i * blockSize,                // dy
                            blockSize,                    // dWidth
                            blockSize                     // dHeight
                        );
                    }
                    else {
                        ctx.clearRect(j * blockSize, i * blockSize, blockSize, blockSize);
                    }
                }
            }
        }
    }
    render() {
        return (
            <canvas ref={this.canvas}
                height={this.blockSize * this.boardHeight}
                width={this.blockSize * this.boardWidth}
            ></canvas>
        );
    }
}

export default Board;
