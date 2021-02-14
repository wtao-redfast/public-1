package com.example.weather

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.databinding.DataBindingUtil
import com.example.weather.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private val viewModel = WeatherViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityMainBinding = DataBindingUtil.setContentView(
            this, R.layout.activity_main)
        binding.viewModel = viewModel
        viewModel.subscribe()

        val button = findViewById<Button>(R.id.button)
        button.setOnClickListener {
            button.isEnabled = false
            viewModel.fetchWeather("Shanghai")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        viewModel.unsubscribe()
    }
}
