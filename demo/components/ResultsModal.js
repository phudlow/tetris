import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { gameStatusChange, showMainMenu } from '../redux/actions';
import Button from './Button';

import Modal from './Modal';

const Score = styled.div`
    font-family: "Consequences";
    font-size: 0.65em;
    & > span {
        font-size: 1.5em;
        font-family: "Captain-Canaveral";
        color: orange;
    }
`;

function ResultsModal(props) {

    if (props.gameStatus !== 'ended') {
        return null;
    }

    return (
        <Modal title="GAME OVER">
            <Score>Score: <span>{props.score}</span></Score>
            <br/>
            <Button onClick={props.showMainMenu}>Main Menu</Button>
            <br/>
            <Button onClick={props.restart}>Restart</Button>
        </Modal>
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
