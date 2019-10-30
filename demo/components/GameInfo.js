import React from 'react';
import { connect } from 'react-redux';

function GameInfo(props) {
    return (
        <div id="gameinfo-container">
            Rows: <span>{props.rows}</span>
            <br/>
            Score: <span>{props.score}</span>
            <br/><br/><br/>
            Level {props.level}
            <br/>
            Next Level in {props.timeToNextLevel}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        score: state.game.score,
        level: state.game.level,
        rows: state.game.rows
    }
};

export default connect(mapStateToProps)(GameInfo);
