import Foundation
import PromiseKit
import Alamofire
import SwiftyJSON

class WeatherApi {    
    static let BASE_URL: String = "https://www.metaweather.com/api/"
    
    func getLocation(city: String) -> Promise<JSON> {
        return Promise { seal in
            let dataRequest = AF.request(WeatherApi.BASE_URL + "location/search/?query=" + city)
            dataRequest.responseJSON { response in
                switch response.result {
                case .success(let value):
                    let json = JSON(value)
                    seal.fulfill(json[0])
                case .failure(let error):
                    seal.reject(error)
                }
            }
            print(dataRequest.description)
        }
    }
    
    func getWeather(woeid: Int) -> Promise<JSON> {
        let today = Date()
        let calendar = Calendar.current
        let url = WeatherApi.BASE_URL + "location/" + String(woeid) + "/" + String(calendar.component(.year, from: today)) + "/" + String(calendar.component(.month, from: today)) + "/" + String(calendar.component(.day, from: today))
        return Promise { seal in
            let dataRequest = AF.request(url)
            dataRequest.responseJSON { response in
                switch response.result {
                case .success(let value):
                    let json = JSON(value)
                    seal.fulfill(json[0])
                case .failure(let error):
                    seal.reject(error)
                }
            }
            print(dataRequest.description)
        }
    }
}
