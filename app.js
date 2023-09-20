const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));

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

// ROUTE HANDLERS

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

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
};

const updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
}

const deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not defined yet' });
}

// ROUTES

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

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);


// START THE SERVER

const PORT = 8000;

app.listen(PORT, () => {
  console.log('💥Server running on port ' + PORT + "💥");
});
