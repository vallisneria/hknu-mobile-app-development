const express = require('express');
const router = express.Router();

const ctrlLocations = require("../controllers/locations");
const ctrlOthers = require("../controllers/others")

/* location pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* other page */
router.get('/about', ctrlOthers.about);

module.exports = router;
