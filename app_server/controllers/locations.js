const { response } = require("express");
const request = require("request");
const api_option = { server: 'http://localhost:3000' };
if (process.env.NODE_ENV === 'production') { api_option.server = 'https://loc8r-2018250038.herokuapp.com'; }

module.exports.homelist = (req, res) => {
    const path = '/api/locations';
    const request_option = {
        url: api_option.server + path,
        method: 'GET',
        json: {},
        qs: { lat: 37.648752, lng: 126.628350, maxDistance: 1 }
    };

    request(request_option, (error, response, body) => {
        let message = '';
        if (response.statusCode === 200 && body.length) {
            body.map(item => {
                item.distance = formatDistance(item.distance);
                return item;
            })
        } else {
            if (!(body instanceof Array)) {
                message = "API lookup error";
                body = [];
            } else if (!body.length) {
                message = 'No place found nearby'
            }
        }

        res.render('locations-list', {
            title: 'Loc8r - find a place to work with wifi',
            pageHeader: {
                title: 'Loc8r',
                strapLine: 'Find places to work with wifi near you!'
            },
            sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
            locations: body,
            message
        });
    });
};

module.exports.locationInfo = (req, res) => {
    const path = `/api/locations/${req.params.locationid}`;
    const request_option = {
        url: api_option.server + path,
        method: "GET",
        json: {}
    }

    request(request_option, (error, response, body) => {
        if (response.statusCode === 200) {
            body.coords = { lng: body.coords[0], lat: body.coords[1] };

            res.render('location-info', {
                title: body.name,
                pageHeader: {
                    title: body.name,
                },
                sidebar: {
                    context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
                    callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
                },
                location: body
            });
        } else {
            let title, content;
            if (response.statusCode === 404) {
                title = '404, page not found';
                content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            } else {
                title = `${response.statusCode}, Something's gone wrong.`
                content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }
            res.status(response.statusCode);
            res.render('generic-text', { title, content });
        }
    })

};

module.exports.addReview = (req, res) => {
    res.render('location-review-form',
        {
            title: 'Review Starcups on Loc8r',
            pageHeader: { title: 'Review Starcups' }
        }
    );
};


function formatDistance(distance) {
    let thisdistance = 0;
    let unit = 'm';

    if (distance >= 1000) {
        thisdistance = parseFloat(distance / 1000).toFixed(1);
        unit = 'km';
    } else {
        thisdistance = Math.floor(distance);
    }

    return thisdistance + unit;
}