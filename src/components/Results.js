import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { gameStatusChange } from '../redux/actions';

const ModalContainer = styled.div`
    display: ${props => props.gameEnded ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,0.5);
    
`;

const Modal = styled.div`
    height: 300px;
    width: 300px;
    text-align: center;
    background-color: white;
`;

function Results(props) {
    return (
        <ModalContainer gameEnded={props.gameStatus === 'ended'}>
            <Modal>
                <h1>Game Over</h1>
                <br/>
                <strong>Score:</strong> {props.score}
                <br/><br/>
                <button onClick={props.gameStatusChange.bind(null, null)}>OK</button>
            </Modal>
        </ModalContainer>
    );
}

const mapStateToProps = state => {
    return {
        gameStatus: state.gameStatus,
        score: state.score
    };
};

const mapDispatchToProps = dispatch => {
    return {
        gameStatusChange: status => dispatch(gameStatusChange(status)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
