import UIKit
import PromiseKit
import SwiftyJSON
import ReSwift

class ViewController: UIViewController, StoreSubscriber {
    var sideEffect: WeatherSideEffect?
    @IBOutlet var weatherLabel: UILabel!
    @IBOutlet weak var ctaButton: UIButton!
    
    @IBAction func fetchWeather(_ sender: Any) {
        if let sideEffect = sideEffect {
            sideEffect.fetchWeather()
            ctaButton.isEnabled = false
        }
    }
    
    func newState(state: AppState) {
        if sideEffect == nil || sideEffect!.api !== state.appShared.api {
            sideEffect = WeatherSideEffect(api: state.appShared.api)
        }
        if let weather = state.weather {
            let temp = weather["the_temp"].intValue
            weatherLabel.text = "Shanghai outside \(temp) degrees"
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        mainStore.subscribe(self)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        mainStore.unsubscribe(self)
    }
}

