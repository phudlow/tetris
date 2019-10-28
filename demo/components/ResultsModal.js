import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { gameStatusChange, showMainMenu } from '../redux/actions';
import Button from './Button';

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
    z-index: 2;
`;

const Modal = styled.div`
    position: absolute;
    padding: 15px;
    height: 300px;
    width: 300px;
    text-align: center;
    background-color: white;
`;

const Title = styled.div`
    font-size: 1em;
    font-family: Consequences Italic;
`;

const Score = styled.div`
    font-family: "Consequences";
    font-size: 0.65em;
    & > span {
        font-size: 1.5em;
        font-family: "Captain-Canaveral";
        color: orange;
    }
`;

const ButtonContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
`;

function ResultsModal(props) {
    return (
        <ModalContainer gameEnded={props.gameStatus === 'ended'}>
            <Modal className="bordered">
                <Title>Game Over</Title>
                <br/>
                <Score>Score: <span>{props.score}</span></Score>
                <br/><br/>
                <ButtonContainer>
                    <Button onClick={props.showMainMenu}>Main Menu</Button>
                    <br/>
                    <Button onClick={props.restart}>Restart</Button>
                </ButtonContainer>
            </Modal>
        </ModalContainer>
    );
}

const mapStateToProps = state => {
    return {
        gameStatus: state.game.gameStatus,
        score: state.game.score
    };
};

const mapDispatchToProps = dispatch => {
    return {
        gameStatusChange: status => dispatch(gameStatusChange(status)),
        showMainMenu: () => dispatch(showMainMenu())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsModal);
