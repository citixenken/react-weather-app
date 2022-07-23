import "./App.css";
import { useState } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/current-weather/CurrentWeather";
import { WEATHER_API_KEY, WEATHER_API_URL } from "./api";
import Forecast from "./components/forecast/Forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  function handleOnSearchChange(searchData) {
    console.log(searchData);
    const [lat, lon] = searchData.value.split(" ");
    //WEATHER AND FORECAST URL & KEY
    //==============================
    const currentWeatherURL = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

    const currentWeatherFetch = fetch(currentWeatherURL);

    const forecastURL = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const forecastFetch = fetch(forecastURL);

    //Promises????
    //============
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        //update weather and forecast based off response. Extend with label data
        //from Geo response
        //==============================================
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ ...forecastResponse, city: searchData.label });
      })
      .catch((error) => console.log(error));
  }

  // console.log(currentWeather, forecast);
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {/* if currentWeather data exists; run <CurrentWeather/> component */}
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
