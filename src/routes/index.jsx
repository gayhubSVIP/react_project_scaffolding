import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'mobx-react';
import App from '../containers/index';
import Home from '../containers/home/index';
import store from '../mobx/store';

// 分割js文件
const About = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('../containers/about/index').default);
    }, 'about');
};

const stores = {
    store,
};

export default (
    <Provider {...stores}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="about" getComponent={About} />
            </Route>
        </Router>
    </Provider>
);
