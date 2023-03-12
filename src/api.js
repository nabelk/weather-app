import { format } from 'date-fns';

export default function FetchApi() {
    const tempFahrCel = {};

    // Get current time/date using timezone data

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

    // Store fahr/cels temperature into object

    const storeTemp = (tempdata) => {
        console.table(tempdata);
        tempFahrCel.cels = {
            temp: Math.round(tempdata.main.temp),
            feelslike: Math.round(tempdata.main.feels_like),
        };
        tempFahrCel.fahr = {
            temp: Math.round((tempdata.main.temp * 9) / 5 + 32),
            feelslike: Math.round((tempdata.main.feels_like * 9) / 5 + 32),
        };
        console.table(tempFahrCel);
    };

    // Process required JSON data

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
        storeTemp({ main: choosenData.main });
        return choosenData;
    };

    // Fetch API

    async function getWeather(place) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&APPID=8ef763a43d647fb183c345fa35741d13`,
            { mode: 'cors' }
        );
        const weatherData = await response.json();
        return weatherData;
    }

    return {
        tempFahrCel,
        getCurrentTimeInTimezone,
        getWeather,
        compileData,
    };
}
