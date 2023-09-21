const express = require('express');
const {
  getAllTours,
  addTour,
  getSingleTour,
  updateTour,
  deleteTour,
  checkID,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
