import { connect } from 'react-redux';

import Board from './Board';

import './../static/background.png';
import './../static/block.png';

class GameBoard extends Board {
    constructor(props) {
        super(props);
    }
}

const mapStateToProps = state => {
    return {
        board: state.board
    };
}

export default connect(mapStateToProps)(GameBoard);
