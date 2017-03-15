import React, { Component } from 'react';
import 'normalize.css';

import Header from '../components/header/index';

export default class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <Header />
                {this.props.children}
            </div>
        );
    }
}
