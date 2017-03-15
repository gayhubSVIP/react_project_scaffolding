import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import userStore from '../../mobx/user.store';

@observer
export default class Home extends Component {
    // constructor(props) {
    //     super(props);
    // }
    componentDidMount() {

    }
    render() {
        return (
            <div>
                <p>Hello React!!!</p>
                <img src={require('../../images/react-logo.png')} />
                <Show userStore={userStore} />
            </div>
        );
    }
}

@inject('store') @observer
class Show extends Component {
    render() {
        const { userStore, store } = this.props;
        return (
            <div>
                <p>{store.config.auth}</p>
                <p>{userStore.user.userName}</p>
            </div>
        );
    }
}
