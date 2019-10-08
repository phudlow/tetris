import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

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
    border: 1px solid black;
`;

function Board(props) {
    const board = props.board;

    const mapValueToStyle = {
        0: { backgroundColor: 'white' },
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
        <BoardContainer>
            {html}
        </BoardContainer>
    );
} 

const mapStateToProps = state => {
    return {
        board: state.board
    };
}

export default connect(mapStateToProps)(Board);
