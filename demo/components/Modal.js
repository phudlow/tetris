import React, { Component } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
    display: flex;
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

const ModalElement = styled.div`
    position: absolute;
    padding: 15px;
    // height: 300px;
    // width: 300px;
    text-align: center;
    background-color: white;
`;

const Title = styled.div`
    // font-size: 1em;
    font-family: Consequences Italic;
`;

class Modal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ModalContainer gameEnded={this.props.gameStatus === 'ended'}>
                <ModalElement className="bordered">
                    <Title>{this.props.title}</Title>
                    <br/>
                    {this.props.children}
                </ModalElement>
            </ModalContainer>
        )
    }
}

export default Modal;
