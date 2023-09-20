const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 🙋‍♀️')
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

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

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get(`/api/v1/tours/:id`, getSingleTour);
// app.patch(`/api/v1/tours/:id`, updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(addTour);
app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

const PORT = 8000;

app.listen(PORT, () => {
  console.log('💥Server running on port ' + PORT + "💥");
});
