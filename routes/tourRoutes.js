const express = require('express');
const {
  getAllTours,
  addTour,
  getSingleTour,
  updateTour,
  deleteTour,
  checkID,
  checkNameAndPriceOfTour,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkNameAndPriceOfTour, addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
