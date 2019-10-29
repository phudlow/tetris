import React from 'react';
import { connect } from 'react-redux';
import { gameStatusChange } from '../redux/actions';

import Modal from './Modal';
import Button from './Button';

function PausedModal(props) {

    if (props.gameStatus !== 'paused') {
        return null;
    }

    return (
        <Modal title="PAUSED">
            <Button onClick={props.resume}>Resume</Button>
            <br/>
            <Button onClick={props.gameStatusChange.bind(null, 'ended')}>End Game</Button>
        </Modal>
    );
}

const mapStateToProps = state => {
    return {
        gameStatus: state.game.gameStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        gameStatusChange: status => dispatch(gameStatusChange(status))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PausedModal);
