import { combineReducers } from 'redux';
import { poemsReducer } from './poems.reducer'
import { loaderReducer } from "./loader.reducer";
import { weatherReducer } from "./weather.reducer";
import {IWeatherState} from "../../interfaces/weather";
import {IPoemState} from "../../interfaces/poem";

export interface IRootReducer {
    poems: IPoemState
    loading: {
        loaded: boolean
    }
    weather: IWeatherState
}

const rootReducer = combineReducers({
    poems: poemsReducer,
    loading: loaderReducer,
    weather: weatherReducer
});

export default rootReducer;