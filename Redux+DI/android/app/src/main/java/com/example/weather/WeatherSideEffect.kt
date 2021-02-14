package com.example.weather

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class WeatherSideEffect(val weatherApi: WeatherApi) {

    fun fetchWeather(city: String) = GlobalScope.launch {
        val weatherData = weatherApi.getWeather(city)
        GlobalScope.launch(Dispatchers.Main) {
            mainStore.dispatch(ActionGetWeather(weatherData))
        }
    }
}