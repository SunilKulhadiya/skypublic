import {applyMiddleware, createStore} from 'redux';
import rootReducer from './rootReducer';
//import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
//import {helloSaga} from './saga';
//import thunk from 'redux-thunk';

//const middleware = [thunk];

// const sagaMiddleware = createSagaMiddleware();

export const MyStore = createStore(rootReducer, applyMiddleware(logger));

// sagaMiddleware.run(helloSaga);

export default MyStore;
