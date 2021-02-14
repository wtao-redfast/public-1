//
//  ContentView.swift
//  Weather
//
//  Created by Wenwei Tao on 5/22/20.
//  Copyright © 2020 Wenwei Tao. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var viewModel = WeatherViewModel()

    var body: some View {
        List(viewModel.weathers) { weather in
            VStack(alignment: .leading) {
                Text(weather.city)
                Text(String(format: "%.2f ℃", weather.temperature))
            }
        }.onAppear(perform: viewModel.loadData)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
