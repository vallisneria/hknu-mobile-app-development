const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) { }

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

module.exports.reviewsUpdateOne = function (req, res) { }

module.exports.reviewsDeleteOne = function (req, res) { }
