import { connect } from 'react-redux';

import Board from './Board';

class PiecePreview extends Board {
    constructor(props) {
        super(props);
    }
}

const mapStateToProps = state => {
    return {
        board: state.game.nextPiece
    };
}

export default connect(mapStateToProps)(PiecePreview);
