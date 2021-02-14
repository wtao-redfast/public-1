import React, { useState, createContext, useEffect } from "react";
import WeatherApi from "../model/WeatherApi";

// Create Context Object
export const WeatherContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const WeatherProvider = (props) => {
    const [weathers, setWeathers] = useState([]);

    useEffect(() => {
        const cities = ["Shanghai", "London", "San Francisco"];
        const loadData = async () => {
            let items = [];
            for (const cityName of cities) {
                let cityWeather = await WeatherApi.getCurrentTemperature(
                    cityName
                );
                items = [
                    {
                        city: cityName,
                        temperature:
                            cityWeather.consolidated_weather[0].the_temp,
                    },
                    ...items,
                ];
            }
            setWeathers(items);
        };
        loadData();
    }, []);

    return (
        <WeatherContext.Provider value={weathers}>
            {props.children}
        </WeatherContext.Provider>
    );
};
