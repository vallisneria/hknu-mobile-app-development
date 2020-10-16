const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
    const locationId = req.params.locationid;

    if (locationId) {
        Loc.findById(locationId).select('reviews').exec((err, location) => {
            if (err) {
                res.status(400).json(err);
            } else {
                addReview(req, res, location);
            }
        })
    } else {
        res.status(404).json({ message: "Location not found" })
    }
}

module.exports.reviewsReadOne = function (req, res) {
    Loc.findById(req.params.locationid).select('name reviews').exec((err, location) => {
        // 장소가 존재하는지 확인
        if (!location) {
            return res.status(404).json({ message: "location not found" });
        } else if (err) {
            return res.status(400).json(err);
        }

        // 리뷰를 가져옴
        if (location.reviews && location.reviews.length > 0) {
            const review = location.reviews.id(req.params.reviewid);

            if (!review) {
                return res.status(404).json({ message: "review not found" })
            } else {
                return res.status(200).json({
                    location: {
                        name: location.name,
                        id: req.params.locationid
                    }, review
                })
            }
        } else {
            return res.status(404).json({ message: "No reviews found" })
        }
    })
}

module.exports.reviewsUpdateOne = function (req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        res.status(404).json({ message: 'Not found, locationid and reciewid are both required' });
    }

    Loc.findById(req.params.locationid).select('reviews').exec((err, location) => {
        if (!location) {
            res.status(404).json(err);
        } else if (err) {
            res.status(400).json(err);
        }

        if (location.reviews && location.reviews.length > 0) {
            const thisReview = location.reviews.id(req.params.reviewid);
            if (!thisReview) {
                res.status(404).json({ message: 'Review not found' });
            } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                location.save((err, location) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        updateAverageRating(location._id);
                        res.status(200).json(thisReview);
                    }
                })
            }
        } else {
            res.status(404).json({ message: 'No review to update' });
        }
    })
}

module.exports.reviewsDeleteOne = function (req, res) {
    const locationId = req.params.locationid;
    const reviewId = req.params.reviewid;
    if (!locationId || !reviewId) {
        return res.status(404).json({ message: 'Not found, locationid and reviewid are both required' });
    }

    Loc.findById(locationId).select('reviews').exec((err, location) => {
        if (!location) {
            return res.status(404).json({ message: 'Location Not found' });
        } else if (err) {
            return res.status(400).json(err);
        }

        if (location.reviews && location.reviews.length > 0) {
            if (!location.reviews.id(reviewId)) {
                return res.status(404).json({ message: 'Review not found' });
            } else {
                location.reviews.id(reviewId).remove();
                location.save(err => {
                    if (err) {
                        return res.status(404).json(err);
                    } else {
                        updateAverageRating(location._id);
                        return res.status(204).json(null);
                    }
                })
            }
        } else {
            return res.status(404).json({ message: 'No review to delete' })
        }
    })
}


function addReview(req, res, location) {
    if (!location) {
        res.status(404).json({ message: "Location not found" })
    } else {
        const { author, rating, reviewText } = req.body;
        location.reviews.push({ author, rating, reviewText });
        location.save((err, location) => {
            if (err) {
                res.status(400).json(err);
            } else {
                updateAverageRating(location._id);
                const thisReview = location.reviews.slice(-1).pop();
                res.status(201).json(thisReview);
            }
        })
    }
}

function updateAverageRating(locationId) {
    Loc.findById(locationId).select('rating reviews').exec((err, location) => {
        if (!err) {
            setAverageRating(location);
        }
    })
}

function setAverageRating(location) {
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((acc, { rating }) => { return acc + rating; }, 0);
        location.rating = parseInt(total / count, 10);
        location.save((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Average rating updated to ${location.rating}`)
            }
        })
    }
}