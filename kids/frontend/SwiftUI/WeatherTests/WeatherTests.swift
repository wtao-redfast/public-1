//
//  WeatherTests.swift
//  WeatherTests
//
//  Created by Wenwei Tao on 5/22/20.
//  Copyright © 2020 Wenwei Tao. All rights reserved.
//

import XCTest
import UIKit
import SwiftUI
@testable import Weather

class WeatherViewModelMock: WeatherViewModel {
    override func loadData() {
        weathers.append(WeatherModel(id: 0, city: "DUMMY", temperature: 20))
    }
}

class WeatherTests: XCTestCase {
    var contentView: ContentView?
    var keyWindow: UIWindow?
    
    override func setUp() {
        contentView = ContentView()
        contentView?.viewModel = WeatherViewModelMock()
        keyWindow = UIApplication.shared.connectedScenes
            .filter({$0.activationState == .foregroundActive})
            .map({$0 as? UIWindowScene})
            .compactMap({$0})
            .first?.windows
            .filter({$0.isKeyWindow}).first
        keyWindow?.rootViewController = UIHostingController(rootView: contentView)
        keyWindow?.makeKeyAndVisible()
    }

    override func tearDown() {
        contentView = nil
        keyWindow = nil
    }
    
    func wait() {
        let _ = XCTWaiter.wait(for: [expectation(description: "Wait for view appearing")], timeout: 1.0)
    }
    
    func testContent() {
        wait()
    }
}
