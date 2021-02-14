import Foundation
import ReSwift
import SwiftyJSON

struct AppState: StateType {
    struct AppShared: StateType {
        var api = WeatherApi()
    }
    
    var appShared = AppShared()
    var weather: JSON?
    var error: Error?
}

struct ActionGetWeather: Action {
    let weather: JSON?
}
struct ActionError: Action {
    let error: Error
}
struct ActionInjectDependency: Action {
    let api: WeatherApi
}

func appReducer(action: Action, state: AppState?) -> AppState {
    var state = state ?? AppState()
    switch action {
    case let action as ActionGetWeather:
        state.weather = action.weather
    case let action as ActionError:
        state.error = action.error
    case let action as ActionInjectDependency:
        state.appShared.api = action.api
    default: break
    }
    return state
}

var mainStore = Store(
    reducer: appReducer,
    state: AppState(),
    middleware: [])
