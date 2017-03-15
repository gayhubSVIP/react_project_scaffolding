import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes/index';

ReactDOM.render(routes, document.getElementById('app'));

// 热加载
if (module.hot) {
    module.hot.accept();
}

// 不设置的话，React DevTools显示不出来
if (typeof window !== 'undefined') {
    window.React = React;
}
