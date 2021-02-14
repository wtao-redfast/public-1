//
//  WeatherApi.swift
//  Weather
//
//  Created by Wenwei Tao on 5/22/20.
//  Copyright © 2020 Wenwei Tao. All rights reserved.
//

import Foundation

struct Location: Codable {
    let title: String
    let woeid: Int
}

struct WeatherItem: Codable {
    let the_temp: Double
}

struct WeatherData: Codable {
    let consolidated_weather: [WeatherItem]
}

let baseUrl = "https://www.metaweather.com"
let locationSearch = "/api/location/search/?query="
let cityWeather = "/api/location/"

class WeatherApi {
    static func getCurrentTemperature(_ city: String, _ onComplete: @escaping (WeatherItem)->Void) {
        guard let url = URL(string: baseUrl + locationSearch + city.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!) else { return }
        URLSession.shared.dataTask(with: url) { data, _, _ in
            guard let data = data, let location = try? JSONDecoder().decode([Location].self, from: data) else { return }
            guard location.count > 0, let url = URL(string: baseUrl + cityWeather + String(location[0].woeid)) else { return }
            URLSession.shared.dataTask(with: url) { data, _, _ in
                guard let data = data, let weather = try? JSONDecoder().decode(WeatherData.self, from: data) else { return }
                DispatchQueue.main.async {
                    onComplete(weather.consolidated_weather[0])
                }
            }.resume()
        }.resume()
    }
}
