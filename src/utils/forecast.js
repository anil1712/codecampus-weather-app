const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=131bdc23347cb86e242bcd3c84712f93&query=' + latitude + ',' + longitude

    request({ url: url, json: true }, (error, response) => {

        //console.log(response.body);

        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (response.body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, response.body.current.weather_descriptions[0] + ' It is currently ' + response.body.current.temperature + ' degress out. There is a ' + response.body.current.precip + '% chance of rain.')
        }

    })
}

module.exports = forecast