//
//  WeatherViewModel.swift
//  Weather
//
//  Created by Wenwei Tao on 5/23/20.
//  Copyright © 2020 Wenwei Tao. All rights reserved.
//

import Foundation

let cities = ["Shanghai", "London", "San Francisco"]

struct WeatherModel: Identifiable {
    let id: Int
    let city: String
    let temperature: Double
}

class WeatherViewModel: ObservableObject {
     @Published var weathers = [WeatherModel]()
    
    func loadData() {
        var i = 0
        for city in cities {
            WeatherApi.getCurrentTemperature(city) { weather in
                print(weather.the_temp)
                self.weathers.append(WeatherModel(id: i, city: city, temperature: weather.the_temp))
                i = i + 1
            }
        }
    }
}
