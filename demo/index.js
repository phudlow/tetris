import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import './style.scss';

import Game from './components/Game';
import Header from './components/Header';

ReactDOM.render((
    <Provider store={store}>
        <Game />
    </Provider>
), document.getElementById('app'));
