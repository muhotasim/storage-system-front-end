import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from './store';
import logger from "redux-logger"
const store = configureStore({reducer: rootReducer,middleware: [logger]});
const rootElm = document.querySelector("#root")
const root = createRoot(rootElm);
root.render(<Provider store={store}>
    <App/>
</Provider>)