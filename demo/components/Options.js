import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showMainMenu, newOptions } from '../redux/actions';
import Button from './Button';

import keyCodeToKeyName from '../misc/keyCodeToKeyName.json';

const unbindableKeyCodes = [
    9,   // Tab
    91,  // Meta (Windows; Mac: for Chrome and Safari)
    224, // Meta (Mac - for Firefox)
    27,  // Escape
    112, // F1
    113, // F2
    114, // F3
    115, // F4
    117, // F6
    118, // F7
    119, // F8
    120, // F9
    121, // F10
    122, // F11
    123, // F12
];

class Options extends Component {
    constructor(props) {
        super(props);

        this.onKeybindKeyDown = this.onKeybindKeyDown.bind(this);
    }
    onKeybindKeyDown(e) {
        const keyCode         = e.keyCode;
        const target          = e.target;
        const action          = target.getAttribute('action');
        const currentKeyCodes = Object.values(this.props.options.keybinds);

        // Return if pressed key is invalid
        if (unbindableKeyCodes.includes(keyCode)) {
            return;
        }

        // If key is taken, indicate which keybinding already has it with text pulse, and return
        if (currentKeyCodes.includes(keyCode) && action !== this.getActionOfKeyCode(keyCode)) {
            this.handleKeyAlreadyTaken(keyCode);
            return;
        }

        this.props.newOptions({
            keybinds: {
                [action]: keyCode
            }
        });

        target.blur();
    }

    getActionOfKeyCode(keyCode) {
        const keybinds = this.props.options.keybinds;
        return Object.keys(keybinds).find(action => keybinds[action] === keyCode);
    }

    // Pulse label text of keybind option which already has that key
    handleKeyAlreadyTaken(keyCode) {
        const takenByAction       = this.getActionOfKeyCode(keyCode);
        const spanOfTakenByAction = document.querySelector(`#options span[action=${takenByAction}]`);
        spanOfTakenByAction.classList.remove('pulse-text-once');
        spanOfTakenByAction.classList.add('pulse-text-once');

        // If that span was already animated, it's necessary to clone and replace node to see animation again
        var newSpan = spanOfTakenByAction.cloneNode(true);
        spanOfTakenByAction.parentNode.replaceChild(newSpan, spanOfTakenByAction);
    }

    render() {
        const keybinds = this.props.options.keybinds;

        const generateKeybindInput = (action, label) => {
            return (
                <label>
                    <span action={action}>{label}:</span>
                    <input type="text"
                        readOnly={true}
                        action={action}
                        value={keyCodeToKeyName[keybinds[action]]}
                        onKeyDown={this.onKeybindKeyDown}
                        onFocus={e => {
                            e.target.previousSibling.classList.add('pulse-text');
                        }}
                        onBlur={e => {
                            e.target.previousSibling.classList.remove('pulse-text');
                        }}
                    />
                </label>
            );
        }

        return(
            <div id="options">
                {generateKeybindInput('left', "Move Left")}
                {generateKeybindInput('right', "Move Right")}
                <br/>
                {generateKeybindInput('rotate-clockwise', "Rotate Clockwise")}
                {generateKeybindInput('rotate-counterclockwise', "Rotate Counter-Clockwise")}
                <br/>
                {generateKeybindInput('drop', "Drop Piece")}
                <br/>
                {generateKeybindInput('pause', "Pause Game")}
                <br/>
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
        showMainMenu: () => dispatch(showMainMenu()),
        newOptions: options => dispatch(newOptions(options))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
