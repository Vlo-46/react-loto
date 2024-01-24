import {createStore, applyMiddleware, AnyAction, Store} from 'redux';
import {thunk, ThunkDispatch} from 'redux-thunk';
import rootReducer from './reducers';

type RootState = ReturnType<typeof rootReducer>;

const store: Store<RootState, AnyAction> = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkDispatch<RootState, undefined, AnyAction>)
);

export default store;
