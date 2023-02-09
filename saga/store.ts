import { applyMiddleware, createStore } from "redux"; 
import createSagaMiddleware from "@redux-saga/core";
import { createWrapper } from "next-redux-wrapper"; 

import rootSaga from "./saga";
import reducer from "./reducer";



const bindMiddleware  = (middleware:any) =>{
    if(process.env.NODE_ENV !== 'production'){
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

export const makeStore = (context:any)=>{
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(reducer, bindMiddleware([sagaMiddleware])) as any
    store.sagaTask = sagaMiddleware.run(rootSaga)
    return store
}


export const wrapper = createWrapper(makeStore, {debug: true})
