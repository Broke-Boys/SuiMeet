import { configureStore, combineReducers } from "@reduxjs/toolkit";
import post from './posts';
import profile from './profile';

const reducer = combineReducers({post, profile});

export const store = configureStore({
    reducer,
});

export type RootType = ReturnType<typeof store.getState>;
