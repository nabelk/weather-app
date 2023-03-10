import _ from 'lodash';
import FetchApi from './api';

const apiModule = FetchApi();

apiModule
    .getWeather('london')
    .then(apiModule.compileData)
    .catch((err) => console.log('nope'));

// setInterval(logCurrentTimeInTimezone, 1000);
