package com.example.weather

import org.rekotlin.Action
import org.rekotlin.StateType
import org.rekotlin.Store

data class ActionInjectDependency(val api: WeatherApi) : Action
data class AppShared (
    val api: WeatherApi = WeatherApi()
): StateType

data class ActionGetWeather(val weather: WeatherData?) : Action
data class WeatherState (
    val weatherData: WeatherData? = null
): StateType

data class AppState (
    val appShared: AppShared = AppShared(),
    val weatherState:  WeatherState = WeatherState(),
    val error: Exception? = null
): StateType

data class ActionError(val error: Exception) : Action

fun appReducer(action: Action, state: AppState?): AppState {
    val originState = state ?: AppState()
    return AppState(
        weatherState = when (action) {
            is ActionGetWeather -> {
                originState.weatherState.copy(weatherData = action.weather)
            }
            else -> {
                originState.weatherState
            }
        },
        error = when(action) {
            is ActionError -> {
                action.error
            }
            else -> {
                state?.error
            }
        },
        appShared = when (action) {
            is ActionInjectDependency -> {
                originState.appShared.copy(api = action.api)
            }
            else -> {
                originState.appShared
            }
        }
    )
}

val mainStore = Store(
    reducer = ::appReducer,
    state = AppState()
)
