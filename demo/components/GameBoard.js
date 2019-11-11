import { connect } from 'react-redux';

import Board from './Board';

class GameBoard extends Board {
    constructor(props) {
        super(props);
    }
}

const mapStateToProps = state => {
    return {
        board: state.game.board
    };
}

export default connect(mapStateToProps)(GameBoard);
