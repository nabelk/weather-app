import { format } from 'date-fns';

export default function FetchApi() {
    function getCurrentTimeInTimezone(timezoneOffset) {
        const now = new Date();
        const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60000;
        const timezoneTimestamp = utcTimestamp + timezoneOffset * 3600000;
        const timezoneDate = new Date(timezoneTimestamp);
        const date = format(
            new Date(
                `${timezoneDate.getFullYear()}-${
                    timezoneDate.getMonth() + 1
                }-${timezoneDate.getDate()}`
            ),
            'd MMMM yyyy'
        );
        let hour = timezoneDate.getHours();
        if (hour < 10) hour = `0${hour}`;
        let min = timezoneDate.getMinutes();
        if (min < 10) min = `0${min}`;
        const ampm = hour >= 12 ? 'PM ' : 'AM';
        return `${date}, ${hour}:${min} ${ampm}`;
    }

    const compileData = (data) => {
        const choosenData = {
            name: data.name,
            country: data.sys.country,
            main: {
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
            },
            weather: data.weather[0].description,
            wind: data.wind.speed,
            timezone: data.timezone,
        };
        return choosenData;
    };

    async function getWeather(place) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&APPID=8ef763a43d647fb183c345fa35741d13`,
            { mode: 'cors' }
        );
        const weatherData = await response.json();
        return weatherData;
    }

    return {
        getCurrentTimeInTimezone,
        getWeather,
        compileData,
    };
}
