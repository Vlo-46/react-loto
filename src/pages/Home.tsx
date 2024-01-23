import React, { useEffect } from 'react';
import Weather from "../components/weather/Weather";
import { useDispatch, useSelector } from "react-redux";
// import { getWeather } from "../store/actions/weather.action";
import { WeatherData } from "../interfaces/weather";
import {IRootReducer} from "../store/reducers";

export default function Home() {
    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(getWeather('armenia'))
    }, [dispatch]);

    const weatherData: WeatherData[] = useSelector((state: IRootReducer) => state.weather.data)
    const listOfSearchedCountries: string[] = useSelector((state: IRootReducer) => state.weather.listOfSearchedCountries)

    return (
        <>
            <div className="bg-blue-500 text-white p-4">
                <h1>Home page</h1>
                <p>This is a home page</p>

                <Weather weatherData={weatherData} listOfSearchedCountries={listOfSearchedCountries}/>
            </div>
        </>
    )
}