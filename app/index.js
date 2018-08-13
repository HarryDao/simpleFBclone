import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import './styles/index.scss';
import reducers from './reducers';
import thunkMiddleware from './middlewares/thunk';
import App from './components/App';

const store = createStore(
    reducers, 
    {}, 
    applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
, document.querySelector('#root'));