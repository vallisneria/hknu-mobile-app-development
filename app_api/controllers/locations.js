const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.locationsListByDistance = async function (req, res) {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const near = { type: "Point", coordinates: [lng, lat] };
    const geoOptions = { distanceField: "distance.calculated", spherical: true, maxDistance: 200000, $limit: 10 };

    if (!lng || !lat) { return res.status(404).json({ message: "lng and lat query parameters are required" }) }

    try {
        const results = await Loc.aggregate([{ $geoNear: { near, ...geoOptions } }]);
        const locations = results.map(result => {
            return {
                id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distnce: `${result.distance.calculated.toFixed()}m`
            }
        });

        return res.status(200).json(locations);
    } catch (err) {
        console.log(err);
    }
}

module.exports.locationsCreate = function (req, res) { }

module.exports.locationsReadOne = function (req, res) {
    Loc.findById(req.params.locationid).exec((err, location) => {
        if (!location) {
            return res.status(404).json({ message: "location not found" });
        } else if (err) {
            return res.status(404).json(err);
        }
        res.status(200).json(location);
    });
}

module.exports.locationsUpdateOne = function (req, res) { }

module.exports.locationsDeleteOne = function (req, res) { }
