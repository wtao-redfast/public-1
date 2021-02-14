import Foundation
import PromiseKit
import SwiftyJSON
import ReSwift

class WeatherSideEffect {
    let api: WeatherApi
    
    init(api: WeatherApi) {
        self.api = api
    }
    
    func fetchWeather() {
        firstly {
            api.getLocation(city: "Shanghai")
        }.then { city in
            self.api.getWeather(woeid: city["woeid"].intValue)
        }.done { weather in
            mainStore.dispatch(
                ActionGetWeather(weather: weather)
            )
        }.catch {
            mainStore.dispatch(
                ActionError(error: $0)
            )
        }
    }
}
