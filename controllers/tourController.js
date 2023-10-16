const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.topTourAliasMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,price,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE THE QUERY.
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // SEND RESPONSE
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
      message: error,
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
};

exports.updateTour = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;

    const newTour = await Tour.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({ message: 'success', data: newTour });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Fields not complete.' });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndRemove(req.params.id);
    res.status(201).json({ message: 'success', data: newTour });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Fields not complete.' });
  }
};
