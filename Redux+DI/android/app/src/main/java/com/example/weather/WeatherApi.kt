package com.example.weather


import androidx.annotation.Keep
import com.squareup.moshi.Json
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.ResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Converter
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import java.lang.reflect.Type
import java.util.*
import java.util.concurrent.TimeUnit


@Keep
data class LocationData(
    @Json(name = "title") val title: String,
    @Json(name = "location_type") val location_type: String,
    @Json(name = "woeid") val woeid: Int,
    @Json(name = "latt_long") val latt_long: String
)

@Keep
data class WeatherData(
    @Json(name = "weather_state_name") val weather_state_name: String,
    @Json(name = "max_temp") val max_temp: Double,
    @Json(name = "min_temp") val min_temp: Double,
    @Json(name = "the_temp") val the_temp: Double
)

interface IWeatherApi {
    @GET("/api/location/search/")
    suspend fun getLocation(@Query("query") city: String): Response<List<LocationData>>

    @GET("/api/location/{woeid}/{year}/{month}/{day}")
    suspend fun getWeather(@Path("woeid") woeid: Int,
                           @Path("year") year: Int,
                           @Path("month") month: Int,
                           @Path("day") day: Int): Response<List<WeatherData>>
}


open class WeatherApi {
    companion object UnitConverterFactory : Converter.Factory() {
        override fun responseBodyConverter(
            type: Type,
            annotations: Array<out Annotation>,
            retrofit: Retrofit): Converter<ResponseBody, *>? {
            return if (type == Unit::class.java) UnitConverter else null
        }

        private object UnitConverter : Converter<ResponseBody, Unit> {
            override fun convert(value: ResponseBody) {
                value.close()
            }
        }
    }

    private val baseUrl = "https://www.metaweather.com/"

    private val serviceAPi: IWeatherApi = Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(
            OkHttpClient.Builder()
                .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY })
                .readTimeout(120, TimeUnit.SECONDS)
                .build())
        .addConverterFactory(UnitConverterFactory)
        .addConverterFactory(
            MoshiConverterFactory.create(
                Moshi.Builder()
                    .add(KotlinJsonAdapterFactory())
                    .build()))
        .build().create(IWeatherApi::class.java)

    open suspend fun getWeather(city: String): WeatherData? {
        val cityData = serviceAPi.getLocation(city).body()
        return cityData?.let {
            val cal = Calendar.getInstance()
            if (it.isNotEmpty()) {
                val weatherData = serviceAPi.getWeather(
                    it[0].woeid,
                    cal.get(Calendar.YEAR),
                    cal.get(Calendar.MONTH),
                    cal.get(Calendar.DAY_OF_MONTH)
                ).body()
                return weatherData?.let { wit ->
                    if (wit.isNotEmpty()) wit[0] else null
                }
            }
            return null
        }
    }
}