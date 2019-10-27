import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showMainMenu } from '../redux/actions';
import Button from './Button';

class Options extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div id="options">
                Options
                <Button onClick={this.props.showMainMenu}>
                    Main Menu
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        options: state.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showMainMenu: () => dispatch(showMainMenu())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
