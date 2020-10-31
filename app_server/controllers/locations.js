const { post } = require("request");
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
    renderReviewForm(req, res);
};

module.exports.doAddReview = (req, res) => {
    const locationid = req.params.locationid;
    const path = `/api/locations/${locationid}/reviews`;
    const postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    const requestOption = {
        url: api_option.server + path,
        method: "POST",
        json: postdata
    };

    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect(`/location/${locationid}/review/new?err=val`);
    } else {
        request(requestOption, (err, { statusCode }, body) => {
            if (statusCode === 201) {
                res.redirect(`/location/${locationid}`);
            } else if (statusCode === 400) {
                res.redirect(`/location/${locationid}/review/new?err=val`);
            } else {
                showError(req, res, statusCode);
            }
        })
    }
}

function renderReviewForm(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: { title: 'Review Starcups' },
        error: req.query.err
    }
    );
}

function getLocationInfo(req, res, callback) {
    const path = `/api/locations/${req.params.locationid}`;
    const requestOption = {
        url: api_option.server + path,
        method: 'GET',
        json: {}
    }

    request(requestOption, (err, { statusCode }, body) => {
        let data = body;
        if (statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            callback(req, res, data);
        } else {
            showError(req, res, statusCode);
        }
    })
}

function showError(req, res, status) {
    let title, content;
    if (status === 404) {
        title = '404, page not found';
        content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    } else {
        title = `${status}, Something's gone wrong.`
        content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
    res.status(status);
    res.render('generic-text', { title, content });
}

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