const baseUrl = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com";
const locationSearch = "/api/location/search/?query=";
const cityWeather = "/api/location/";

export default class WeatherApi {
    static async getCurrentTemperature(cityName) {
        let response = await fetch(
            baseUrl + locationSearch + encodeURIComponent(cityName)
        );
        let cities = await response.json();
        if (cities.length > 0) {
            response = await fetch(
                baseUrl + cityWeather + cities[0].woeid.toString()
            );
            return await response.json();
        }
        return {};
    }
}
