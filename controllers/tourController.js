const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.topTourAliasMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,price,summary';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
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
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findOne({ _id: req.params.id });
  if (!tour) return next(new AppError('No tour found with that ID', 404));
  res.status(200).json({ message: 'success', data: { tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = req.body;

  const newTour = await Tour.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
  });

  if (!newTour) return next(new AppError('No tour found with that ID', 404));

  res.status(201).json({ message: 'success', data: newTour });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findByIdAndRemove(req.params.id);
  if (!newTour) return next(new AppError('No tour found with that ID', 404));

  res.status(201).json({ message: 'success', data: newTour });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: { $toUpper: '$difficulty' },
        _id: '$difficulty',
        numberOfTours: { $sum: 1 },
        numberOfRatings: { $sum: '$ratingsQuantity' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minimumPrice: { $min: '$price' },
        maximumPrice: { $max: '$price' },
      },
    },
    { $sort: { averagePrice: -1 } },
    // { $match: { _id: { $ne: 'easy' } } },
  ]);
  res.status(200).json({ message: 'success', data: stats });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberOfTourStartingThisMonth: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { _id: 0 } },
    { $sort: { numberOfTourStartingThisMonth: -1 } },
    // { $limit: 6 },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
