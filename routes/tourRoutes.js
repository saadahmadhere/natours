const express = require('express');
const {
  getAllTours,
  createTour,
  getSingleTour,
  updateTour,
  deleteTour,
  topTourAliasMiddleware,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheapest-tours').get(topTourAliasMiddleware, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
