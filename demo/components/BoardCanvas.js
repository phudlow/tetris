import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import './../static/background.png';
import './../static/block.png';

const BoardContainer = styled.div`
    display: inline-flex;
`;

class Board extends Component {
    constructor(props) {
        super(props);

        const board = props.board;

        this.blockSize   = 30;
        this.boardHeight = board.length;
        this.boardWidth  = board[0].length;

        this.canvas = React.createRef();

        this.valueToStyleMap = {
            1: 'blue',
            2: 'red',
            3: 'pink',
            4: 'violet',
            5: 'green',
            6: 'gold',
            7: 'teal'
        };
    }
    shouldComponentUpdate(nextProps) {
        const ctx = this.canvas.current.getContext('2d');

        this.updateBoard(this.props.board, nextProps.board, ctx);
        return false;
    }
    updateBoard(currBoard, nextBoard, ctx) {
        const blockSize = this.blockSize;
        const blocks    = this.props.blocksImg;
        let currValue, nextValue;

        for (let i = 0, numRows = currBoard.length; i < numRows; i++) {
            for (let j = 0, numCols = currBoard[i].length; j < numCols; j++) {
                currValue = currBoard[i][j];
                nextValue = nextBoard[i][j];

                if (currValue !== nextValue) {
                    if (nextValue) {
                        // ctx.fillStyle = this.valueToStyleMap[nextValue];
                        // ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
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

const mapStateToProps = state => {
    return {
        board: state.board,
        count: state.count
    };
}

export default connect(mapStateToProps)(Board);
