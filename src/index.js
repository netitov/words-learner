import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
//import App from './components/App/App';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import ScrollToTop from '../src/components/ScrollToTop/ScrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  //</React.StrictMode>
);
