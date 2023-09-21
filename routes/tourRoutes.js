const fs = require('fs');

const express = require('express');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const router = express.Router();

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({ data: newTour });
      console.log('file written successfully');
    }
  );
};

const getSingleTour = (req, res) => {
  const { id: idFromUrl } = req.params;
  const tour = tours.find((tour) => tour.id === +idFromUrl);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Id not found' });
  }
  res.status(200).json({ message: 'success', data: { tour } });
};

const updateTour = (req, res) => {
  const { id: idFromUrl } = req.params;
  const tour = tours.find((tour) => tour.id === +idFromUrl);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Id not found' });
  }

  const updatedItem = req.body;
  const newTours = tours.map((tour) =>
    tour.id === +idFromUrl ? { ...tour, ...updatedItem } : tour
  );

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    () => {
      res.status(201).json({ message: 'success', data: newTours });
    }
  );
};
 
const deleteTour = (req, res) => {
  const { id: idFromUrl } = req.params;
  const newTours = tours.filter((tour) => tour.id !== +idFromUrl);

  if (newTours.length === tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Id not found' });
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    () => {
      res.status(204).json({ message: 'success', data: null });
    }
  );
};

router.route('/').get(getAllTours).post(addTour);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);


module.exports = router;