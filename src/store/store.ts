import {createStore, applyMiddleware, AnyAction, Store} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {thunk, ThunkDispatch} from 'redux-thunk';
import rootReducer from './reducers';
import {IPoem} from "../interfaces/poem";

type RootState = {
    poems: {
        poems: IPoem[];
    };
};

const store: Store<RootState, AnyAction> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk as ThunkDispatch<RootState, undefined, AnyAction>))
);

export default store;