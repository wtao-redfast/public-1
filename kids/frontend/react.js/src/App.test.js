import React from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";
import WeatherApi from "./model/WeatherApi";
import { WeatherProvider } from "./viewModel/WeatherViewModel";

test("renders learn react link", async () => {
    WeatherApi.getCurrentTemperature = jest.fn(() => {
        return { consolidated_weather: [{ the_temp: -15 }] };
    });
    let renderer = null;
    await act( async () => {
        renderer = render(
            <WeatherProvider>
                <App />
            </WeatherProvider>
        );
    });
    const { getAllByTestId } = renderer;
    let tempNode = getAllByTestId("temperature");
    expect(tempNode[0].innerHTML).toBe("-15℃");
});
