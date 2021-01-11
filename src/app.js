/*
 - About Query String (http://myapi.mydomain.com?address=Nehru Nagar Bhilai&user_id=12345)
 - Will create a node app which should accept address as parameter from URL as query parameter and will return the forecast information as JSON response
 - HTTP 
    GET: Querystring
    POST: Req Body
            HTML (text/html)
            JSON (application/json)
            Form Data
            binary/blob (multipart/form-data)
          Res Body
            HTML (text/html)
            JSON (application/json)
            PDF
            ZIP
            DOC
            IMG
 */
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const path = require('path');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')
const request = require('request');
const j = request.jar();
const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, './../public');

function myLogger(req, res, next) {
    console.log('===Logged===', req.path);
    const availableRoutes = ['/help', '/service', '/weather', '/student', '/iframe'];
    if(availableRoutes.includes(req.path)) {
        next();
    } else {
        res.send({
            error: 'Page not found!'
        });
    }
}

app.use('/static', express.static(publicDirPath));
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(myLogger);
app.use(bodyParser.json({ type: 'application/json' }))


// function checkSessionExist(req, res) {
//     const session_exist = true;
//     if(!session_exist) {
//         res.send({error: 'Authorization error'});
//     }
// }







app.get('/iframe', (req, res) => {
    const url = 'https://metacogma.sharepoint.com/_forms/default.aspx';
    const cookieValue = 'MicrosoftApplicationsTelemetryDeviceId=d2c0c465-d5c7-dd23-7f4a-d2da168bbd17; MicrosoftApplicationsTelemetryFirstLaunchTime=1610216727779; rtFa=z9him6yh8iw81RBWy/hDD3+9lCiCfWyhm0NRktpMMOEmQzFBN0JDREMtNEJFRS00RDczLTkxMUUtNjE0ODUzMjA1MUI4J2s65cOsZC30kbMVqgHB+Ew7EvOlmfgem7EZhnVg70zPneLbHeSNz8sEtv0aLO2BXdOw4WOUompggQg5lL5W2fNexCzILiVclQ9teSlsjBn8Qia5o2VnNfxaDNVT4Wy77hFNQdGmVIijBBoEIix4EVAp/+TTacgMxr3b9bfaPV1e6Y7SvAzZSyOklzsbWFK+MmNK67cHiKtJ/gja0qu0FHkyixZmtqhlDv6mjcfW2D/EYn+LgAsFGE76p5rXH4o+FJ4He0YK61JoifXnpFO4oDeZ3vtMzHDMxWItPxMRn5pAHqMNPp9cOe6H/wbHCG7QvRBVvvz3ceA5xIhTuuyUuUUAAAA=; databaseBtnText=0; databaseBtnDesc=0; WSS_FullScreenMode=false; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+VjgsMGguZnxtZW1iZXJzaGlwfDEwMDMyMDAwZDY3MzJjNzlAbGl2ZS5jb20sMCMuZnxtZW1iZXJzaGlwfGFuaWxAbWV0YWNvZ21hLmNvbSwxMzI1NDUyNzk3MTAwMDAwMDAsMTMyNDEyNzczMjgwMDAwMDAwLDEzMjU1MTIxODMzNjc5NjI0Miw0OS4xNS4xNzQuMjUsMyxjMWE3YmNkYy00YmVlLTRkNzMtOTExZS02MTQ4NTMyMDUxYjgsLDU2OGJhOTExLWVlZTQtNDcyNS05NTVjLWE2NTNkZmNjNjFmZiw1Yjg5MjkzOS1kNWQyLTQ5NDctYTE4NC02YjJmMDlhMGRlNzEsNWI4OTI5MzktZDVkMi00OTQ3LWExODQtNmIyZjA5YTBkZTcxLCwwLDEzMjU0Nzc2MjMzNjY0MDAwNiwxMzI1NDk0OTAzMzY2NDAwMDYsLCxleUo0YlhOZlkyTWlPaUpiWENKRFVERmNJbDBpTENKNGJYTmZjM050SWpvaU1TSjksMjY1MDQ2Nzc0Mzk5OTk5OTk5OSwxMzI1NDY4OTgzMzAwMDAwMDAsZGYwOTNkYTAtODg2Yy00ZmJhLWE4M2MtOWIwODI4OGMzNWExLE13Rkg4T21PWWpYVk9abThYclI4VVh5TUppcU1RdzMxUGlkRnhnVGwxVUNOakFtTFRoMzhiVHJBR3FOYzJBTmMxNTd6WHM4UGp4Ry83L2Y0TS9SVWplMDNGSHk0blJucXZYbHhKYmxmSGFLWlNjMm5jTEdJVmRJRTBQZWNzeURCcmlTaEV0NTFNRmZwa0YvK1FxZHV3MHp1TExRcDhGeGZxZWswTEUzTmR0N0lUMGRpUkV2SlpYS1YzTFN4T0o5TDlqRVExMmlMWktjbFFveDA5Z2svdnFCcnRpSHRxQW1LSzl2MnlYWnJBNVp5dWhBa056NTdTRFhhcmcrTDBHK3RSSGg0c01EaEtDd25PeDArUjRYb21kc3pmSE55Y1puR1VXN2FoN2c4d3VnTVZuNEdiVFJtVzBCcVY2MmhhMzBxZHRON1VOQy9ybmpUZHZuWldMZzVHZz09PC9TUD4=; CCSInfo=MS8xNS8yMDIxIDI6MDE6NTMgQU1GhigM1XoN7yEmc1ZDsD0Ty1lthGKRTi3iFttEQHs8W+yvcd5Rvp0FFLgDyYbpVwWAzZbkPTOk8JdRuuDWpXxxX22dEAEwdoSsS9IlgCDc27xpaeM2+lNSpgx/Rcbv9zP5WM+pT7nA1JYWsQ8cK9FZXTSAES/xUHvOdfWYem5RWHhK+g/UTGiP/oAviw5sPpDEHBSxbOBCTTBY6g+aIvwKo0IWY6TPuNAi0a87DpHpeQgy07K7nZTkAw4T9ktZwgLSDc7iH6RZqgOgY+kShD+UDojOdjVsgldLfXhgOhT0/XAVffOJmAQ9mjjd6yNhH+w6iNikheJJ3cc8ClGJ3877FAAAAA==; odbn=1; WordWacDataCenter=PSG3; WacDataCenter=PSG3';
    const cookie = request.cookie(`cookie=${cookieValue}`);
    j.setCookie(cookie, url);
    
    request({ 
        url: url,
        jar: j,
        headers: {
            'x-accesstoken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkcydDJKYzlkMVZ6RkdjdzZUZy02YUhZVXk2VSJ9.eyJhdWQiOiJ3b3BpL21ldGFjb2dtYS5zaGFyZXBvaW50LmNvbUBjMWE3YmNkYy00YmVlLTRkNzMtOTExZS02MTQ4NTMyMDUxYjgiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDBAOTAxNDAxMjItODUxNi0xMWUxLThlZmYtNDkzMDQ5MjQwMTliIiwibmJmIjoiMTYxMDIxNjM4MiIsImV4cCI6IjE2MTAyNTIzODIiLCJuYW1laWQiOiIwIy5mfG1lbWJlcnNoaXB8YW5pbEBtZXRhY29nbWEuY29tIiwibmlpIjoibWljcm9zb2Z0LnNoYXJlcG9pbnQiLCJpc3VzZXIiOiJ0cnVlIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MTAwMzIwMDBkNjczMmM3OUBsaXZlLmNvbSIsInNpZ25pbl9zdGF0ZSI6IltcImttc2lcIl0iLCJpc2xvb3BiYWNrIjoiVHJ1ZSIsImFwcGN0eCI6ImUwNTY5NDY5YjA4NzQyY2JhMTU0ZDU0OTY5NmYyMmU1O3ZYam1GZUVqbHNqeE0xWnkzMU9mRVZpSkFFMD07RGVmYXVsdDs7N0ZGRkZGRkZGRkZCRkZGRjtUcnVlOzs7MDtjZmE4OWY5Zi05MDVjLWEwMDAtZDk5Yi1hMDhkNWYzNTg0NmIifQ.Hpq2oqU0h6oMO9qzTONeJH5b0jmNrIHKEGPK0zE3R_6qD4JXe4KjXjuYJLUnktvJvwV8NNOVgQdkRG0K_8nrjC4w-1FDYdF5UWxPWpxsp1torQ4N95JoiHjCBG9cU6bFsGapgeFBi_RNrVbFvRWcU3Pxztmyi5gLJv2KLxEAx0TYpeKK83y81WtmQoHQ65evOZLTbNuw30D0dLAJAkyibUOxx4kPEafEh5WNw-UyLNBRAX2h_g_0JP3YbE9UJ1Rr1UY9mJCgyG_QWTggILrTHreXCQd0MTPODJ3TW_iTf3DnnRQWKk6nUfJRgPavF6RFmYOHIRL9uAe4JtfQ-nhG5Q'
        }
    }, (error, response) => {
        //console.log(response);
        res.send(response.body);
    });
    
})









app.post('/student', (req, res) => {
    //console.log(req.body);
    res.send({
        status: 200,
        message: 'Student data saved!',
        data: req.body
    })
})

app.put('/student', (req, res) => {
    //console.log(req.body);
    res.send({
        status: 200,
        message: 'Student data updated!',
        data: req.body
    })
})

app.delete('/student', (req, res) => {
    //console.log(req.body);
    res.send({
        status: 200,
        message: 'Student data deleted!',
        data: req.body
    })
})

app.get('/help', (req, res) => {
    return res.send({
        data: 'Help page response!'
    })
})


app.get('/service', (req, res) => {
    return res.send({
        data: 'Service page response!'
    })
})

app.get('/weather', (req, res) => {
    //console.log(req.query);

    return res.send({
        data: 'Weather api response!'
    })

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    // geocode(req.query.address, (error, { latitude, longitude, location }) => {
    //     if (error) {
    //         return res.send({ error })
    //     }

    //     forecast(latitude, longitude, (error, forecastData) => {
    //         if (error) {
    //             return res.send({ error })
    //         }

    //         res.send({
    //             forecast: forecastData,
    //             location,
    //             address: req.query.address
    //         })
    //     })
    // })
})

app.listen(port, () => {
    console.log('Server is up on port 3001.')
})