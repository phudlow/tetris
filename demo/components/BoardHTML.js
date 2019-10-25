import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import './../static/background.png';

const Block = styled.div`
    margin: 1px;
    height: 30px;
    width: 30px; 
    border-radius: 3px;
    background-color: ${props => props.styles.backgroundColor}
`;

const Row = styled.div`
    display: inline-flex;
    flex-direction: row;
`;

const BoardContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    background-color: transparent;
    border-image-source: url('./static/background.png');
    border-image-slice: 20;
    border-image-width: 20px;
    border-image-outset: 18px;
    border-image-repeat: repeat;
    border-style: inset;
`;

function Board(props) {
    const board = props.board;

    const mapValueToStyle = {
        0: { backgroundColor: 'transparent' },
        1: { backgroundColor: 'blue' },
        2: { backgroundColor: 'red' },
        3: { backgroundColor: 'pink' },
        4: { backgroundColor: 'violet' },
        5: { backgroundColor: 'green' },
        6: { backgroundColor: 'gold' },
        7: { backgroundColor: 'teal' }
    }

    const html = board.map((row, idx) => {
        return (
            <Row key={idx}>
                {row.map((value, idx) => {
                    return (
                        <Block styles={mapValueToStyle[value]} key={idx}/>
                    )
                })}
            </Row>
        );
    });
    return (
        <BoardContainer className="board-container">
            {html}
        </BoardContainer>
    );
} 

const mapStateToProps = state => {
    return {
        board: state.board,
        count: state.count
    };
}

export default connect(mapStateToProps)(Board);
