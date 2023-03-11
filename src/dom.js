import FetchApi from './api';

export default function DOM() {
    const api = FetchApi();
    const form = document.querySelector('form');
    const weatherDiv = document.querySelector('.weather-info');

    function displayTime(timezone) {
        const getTime = api.getCurrentTimeInTimezone(timezone / 3600);
        weatherDiv.appendChild(
            Object.assign(document.createElement('div'), {
                textContent: getTime,
            })
        );
    }

    function displayWeatherInfo(data) {
        weatherDiv.textContent = '';
        weatherDiv.append(
            Object.assign(document.createElement('h1'), {
                textContent: `${data.name}, ${data.country}`,
            }),
            Object.assign(document.createElement('div'), {
                textContent: `${data.weather
                    .charAt(0)
                    .toUpperCase()}${data.weather.slice(1)}`,
            }),
            Object.assign(document.createElement('div'), {
                textContent: Math.round(data.main.temp),
            }),
            Object.assign(document.createElement('div'), {
                textContent: `Feels like: ${Math.round(data.main.feels_like)}°`,
            }),
            Object.assign(document.createElement('div'), {
                textContent: `Humidity: ${data.main.humidity}%`,
            }),
            Object.assign(document.createElement('div'), {
                textContent: `Wind: ${data.wind} km`,
            })
        );
        displayTime(data.timezone);
    }

    function errorSpan() {
        const span = document.createElement('span');
        span.textContent = "Place can't be find...";
        setTimeout(() => span.remove(), 1500);
        return span;
    }

    function searchWeather(event) {
        event.preventDefault();
        api.getWeather(event.target.search.value)
            .then(api.compileData)
            .then(displayWeatherInfo)
            .catch(() => form.appendChild(errorSpan()));
    }
    form.addEventListener('submit', searchWeather);
}
