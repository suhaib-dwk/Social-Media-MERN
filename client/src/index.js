import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// explain code 
/*
authReducer: A reducer function that manages the state of our authentication feature.
configureStore: A function from the @reduxjs/toolkit package that creates a Redux store with predefined middleware and reducer handling.
Provider: A React component that makes the Redux store available to all components in the application.
persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, and REGISTER: These are modules from the redux-persist package, which allows us to persist our Redux store data between sessions.
storage: A storage engine that we will use to persist our store data.
PersistGate: A React component that delays the rendering of the application until the persisted state has been retrieved and saved.

Here, we are creating a configuration object persistConfig that defines the key to be used for our persisted state, the storage engine to be used (storage), and the version of the persisted state. Then we are creating a new reducer function persistedReducer by passing the persistConfig object and the authReducer function to the persistReducer method. This new reducer function will be used to manage the persisted state of our application.

Here, we are creating a new Redux store by calling the configureStore method and passing an object that includes a reducer property and a middleware property. The reducer property is set to our persistedReducer function, which will manage the persisted state of our application. The middleware property is set to a function that returns an array of middleware functions with a custom serializableCheck option that ignores certain actions (FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, and REGISTER) that are used by the redux-persist package

ReactDOM.createRoot creates a new root level React component that can be used to render the entire application.
root.render is used to render the entire application onto the root element in the HTML document.
<React.StrictMode> is a built-in React component that helps identify potential problems in an application's code by enabling additional warnings and error checking.
<Provider> is a component provided by the Redux library that allows the application to access the store (state container) across all components.
<PersistGate> is a component provided by the Redux Persist library that delays the rendering of the application until the persisted state has been retrieved and saved to the store.
loading={null} is used to specify that no special loading component is needed while waiting for the persisted state to be retrieved and saved.
persistor={persistStore(store)} specifies the Redux Persist store enhancer that will persist the store data across sessions and restores it.
<App /> is the main application component that will be rendered inside the Provider and PersistGate components.
*/