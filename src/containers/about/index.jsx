import React, { Component } from 'react';

export default class About extends Component {
    render() {
        return (
            <div>
                <p>About react-kit</p>
                <img src={require('../../images/babel.png')} />
            </div>
        );
    }
}
