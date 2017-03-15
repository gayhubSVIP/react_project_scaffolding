import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import './header.scss';

export default class Header extends Component {
    render() {
        return (
            <nav>
                <IndexLink to="/" activeClassName="active">Home</IndexLink>
                <br /><br />
                <Link className="test1" to="/about" activeClassName="active">About</Link>
            </nav>
        );
    }
}
