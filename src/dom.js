import FetchApi from './api';

export default function DOM() {
    const api = FetchApi();
    const form = document.querySelector('form');
    const weatherDiv = document.querySelector('.weather-info');
    const checkBoxTemp = document.querySelector('input#checkTemp');

    function changeBgImg(type) {
        document.body.style.backgroundImage = `url('./weather-img/${type.replaceAll(
            ' ',
            ''
        )}.jpg')`;
    }

    function changeTempFormat(event) {
        const tempDiv = document.querySelector('.weather-info div.temp');
        const feelslikeDiv = document.querySelector(
            '.weather-info div.feelslike'
        );
        if (event.target.checked) {
            tempDiv.textContent = `${api.tempFahrCel.fahr.temp}°F`;
            feelslikeDiv.textContent = `Feels like: ${api.tempFahrCel.fahr.feelslike}°F`;
        } else {
            tempDiv.textContent = `${api.tempFahrCel.cels.temp}°C`;
            feelslikeDiv.textContent = `Feels like: ${api.tempFahrCel.cels.feelslike}°C`;
        }
    }
    checkBoxTemp.addEventListener('change', changeTempFormat);

    function displayTime(timezone) {
        const getTime = api.getCurrentTimeInTimezone(timezone / 3600);
        weatherDiv.appendChild(
            Object.assign(document.createElement('div'), {
                textContent: getTime,
            })
        );
    }

    function displayWeatherInfo(data) {
        changeBgImg(data.weather);
        weatherDiv.textContent = '';
        const temp = checkBoxTemp.checked
            ? `${api.tempFahrCel.fahr.temp}°F`
            : `${api.tempFahrCel.cels.temp}°C`;
        const feelslike = checkBoxTemp.checked
            ? `${api.tempFahrCel.fahr.feelslike}°F`
            : `${api.tempFahrCel.cels.feelslike}°C`;
        const imgDiv = document.createElement('div');
        imgDiv.appendChild(
            Object.assign(document.createElement('img'), {
                src: `https://openweathermap.org/img/wn/${data.icon}.png`,
            })
        );
        weatherDiv.append(
            Object.assign(document.createElement('div'), {
                textContent: `${data.weather
                    .charAt(0)
                    .toUpperCase()}${data.weather.slice(1)}`,
            }),
            Object.assign(document.createElement('h1'), {
                textContent: `${data.name}, ${data.country}`,
            }),
            Object.assign(document.createElement('div'), {
                textContent: temp,
                className: 'temp',
            }),
            Object.assign(imgDiv),
            Object.assign(document.createElement('div'), {
                textContent: `Feels like: ${feelslike}`,
                className: 'feelslike',
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

    function tryAPi(value) {
        api.getWeather(value)
            .then(api.compileData)
            .then(displayWeatherInfo)
            .catch(() => form.appendChild(errorSpan()));
    }

    function searchWeather(event) {
        event.target.search.disabled = true;
        event.target.lastElementChild.classList.add('loading');
        event.preventDefault();
        setTimeout(() => {
            event.target.lastElementChild.classList.remove('loading');
            tryAPi(event.target.search.value);
            setTimeout(() => {
                event.target.search.disabled = false;
            }, 1000);
            form.reset();
        }, 1000);
    }
    form.addEventListener('submit', searchWeather);

    tryAPi('Malaysia');
}
