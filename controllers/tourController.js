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
    // BUILD THE QUERY
    // 1A) FILTERING
    const queryObject = { ...req.query };
    const excluedFields = ['page', 'sort', 'limit', 'fields'];
    excluedFields.forEach((el) => delete queryObject[el]);

    // filtering:
    // .find({price: {$gte: 340}, rating: {$lte: 4.5})

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    let query = Tour.find(queryStr);

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    //another mehtod of writing queries:
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('rating')
    //   .gte(4.5);

    // 2) SORTING
    // EXECUTE THE QUERY.
    const tours = await query;

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
