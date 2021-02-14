import React, { useContext } from "react";
import "./App.css";
import { WeatherContext } from "./viewModel/WeatherViewModel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {version} from '../package.json';

// more UI widgets demo from https://v3.material-ui.com/
function App() {
    const weathers = useContext(WeatherContext);
    return (
        <div className="App">
            <p>version {version}</p>
            <header className="App-header">
                {weathers.map((weather, index) => (
                    <Paper
                        key={index}
                        style={{ width: "500px", marginTop: "50px" }}
                    >
                        <Typography variant="h5" component="h3">
                            {weather.city}
                        </Typography>
                        <Typography component="p" data-testid="temperature">
                            {Math.round(weather.temperature).toString() + "℃"}
                        </Typography>
                    </Paper>
                ))}
            </header>
        </div>
    );
}

export default App;
