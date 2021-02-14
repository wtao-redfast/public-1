package com.example.weather

import androidx.databinding.ObservableField
import org.rekotlin.StoreSubscriber

class WeatherViewModel: StoreSubscriber<AppState> {

    private lateinit var sideEffect: WeatherSideEffect

    val weather = ObservableField("Find temperature in Shanghai")

    fun subscribe() {
        mainStore.subscribe(this)
    }

    fun unsubscribe() {
        mainStore.unsubscribe(this)
    }

    fun fetchWeather(city: String) {
        sideEffect.fetchWeather(city)
    }

    override fun newState(state: AppState) {
        if (!::sideEffect.isInitialized || sideEffect.weatherApi !== state.appShared.api) {
            sideEffect = WeatherSideEffect(state.appShared.api)
        }
        state.weatherState.weatherData?.let {
            weather.set(String.format("Shanghai outside %d degrees", it.the_temp.toInt()))
        }
    }
}