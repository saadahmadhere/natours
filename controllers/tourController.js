const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.checkNameAndPriceOfTour = (req, res, next) => {
  // if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price')) {
  //   return res
  //     .status(404)
  //     .json({ status: 'fail', message: 'Name and price are required' });
  // }
  // next();
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'failed to get all tours',
    });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({ message: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ message: 'fail', error: error });
  }
  // const tour = tours.find((tour) => tour.id === +idFromUrl);
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Fields not complete.' });
  }
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = { id: newId, ...req.body };
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   () => {
  //     res.status(201).json({ data: newTour });
  //     console.log('file written successfully');
  //   },
  // );
};

exports.updateTour = (req, res) => {
  // const { id: idFromUrl } = req.params;
  // const tour = tours.find((tour) => tour.id === +idFromUrl);
  // const updatedItem = req.body;
  // const newTours = tours.map((tour) =>
  //   tour.id === +idFromUrl ? { ...tour, ...updatedItem } : tour,
  // );
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(newTours),
  //   () => {
  //     res.status(201).json({ message: 'success', data: newTours });
  //   },
  // );
};

exports.deleteTour = (req, res) => {
  // const { id: idFromUrl } = req.params;
  // const newTours = tours.filter((tour) => tour.id !== +idFromUrl);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(newTours),
  //   () => {
  //     res.status(204).json({ message: 'success', data: null });
  //   },
  // );
};
