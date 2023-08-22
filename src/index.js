import React from 'react';
import { render } from 'react-dom';
import App from './Containers/App';
import { Provider } from 'react-redux';
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';


render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);


