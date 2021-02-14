//
//  WeatherTests.swift
//  WeatherTests
//
//  Created by Tao, Wenwei on 7/29/19.
//  Copyright © 2019 Tao, Wenwei. All rights reserved.
//

import XCTest
@testable import Weather
import PromiseKit
import SwiftyJSON
import ReSwift

class WeatherTests: XCTestCase {
    class FakeApi: WeatherApi {
        override func getLocation(city: String) -> Promise<JSON> {
            return Promise { seal in
                var json = JSON()
                json["woeid"].intValue = 1234
                seal.fulfill(json)
            }
        }
        
        override func getWeather(woeid: Int) -> Promise<JSON> {
            return Promise { seal in
                var json = JSON()
                json["the_temp"].intValue = 37
                seal.fulfill(json)
            }
        }
    }
    
    var viewController: ViewController!
    let window = UIWindow(frame: UIScreen.main.bounds)
    
    override func setUp() {
        super.setUp()
        mainStore.dispatch(ActionInjectDependency(api: FakeApi()))
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        viewController = (storyboard.instantiateViewController(withIdentifier: "mainView") as! ViewController)
        window.rootViewController = viewController
    }

    override func tearDown() {
        window.isHidden = true
        window.rootViewController = nil
        super.tearDown()
    }

    func testFetchWeather() {
        window.makeKeyAndVisible()
        if let ctaButton = viewController.view.findViewByAccessibilityId("ctaButton") as? UIButton {
            ctaButton.sendActions(for: .touchUpInside)
            wait(timeout: 1)
            if let label = viewController.view.findViewByAccessibilityId("cityWeather") as? UILabel, let text = label.text, text.contains("37") {
                XCTAssertTrue(true)
                return
            }
        }
        XCTAssertTrue(false)
    }

    func testPerformanceExample() {
        self.measure {
        }
    }

}

extension XCTestCase {
    func wait(timeout: Double = 10) {
        CFRunLoopRunInMode(.defaultMode, timeout, false)
    }
}

extension UIView {
    func findViewByAccessibilityId(_ id: String) -> UIView? {
        if id == accessibilityIdentifier {
            return self
        }
        for subview in subviews {
            if let matched = subview.findViewByAccessibilityId(id) {
                return matched
            }
        }
        return nil
    }
}
