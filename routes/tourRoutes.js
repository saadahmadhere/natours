const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

const {getAllTours, addTour, getSingleTour, updateTour, deleteTour} = tourController;

router.route('/').get(getAllTours).post(addTour);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);


module.exports = router;