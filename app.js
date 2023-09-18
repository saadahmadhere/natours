const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get(`/api/v1/tours/:id`, (req, res) => {
  const { id: idFromUrl } = req.params;
  const tour = tours.find((tour) => tour.id === +idFromUrl);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Id not found' });
  }
  res.status(200).json({ message: 'success', data: { tour } });
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log('💥Server running on port ' + PORT);
});
