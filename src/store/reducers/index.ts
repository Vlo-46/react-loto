import { combineReducers, Reducer } from 'redux';
import { loaderReducer } from "./loader.reducer";

export interface IRootState {
    loading: {
        loaded: boolean;
    };
}

const rootReducer: Reducer<any, any> = combineReducers({
    loading: loaderReducer,
});

export default rootReducer;
