const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxLength: [
        40,
        'A tour name must be less than or equal to 40 characters',
      ],
      minLength: [
        5,
        'A tour name must be greater than or equal to 5 characters',
      ],
      // validate: [validator.isAlpha, 'The tour name must be a string.'],
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discount: Number,
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium, and difficult',
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to the current document on NEW document creation, and does not work with document update.
          return val < this.price;
        },
        message: 'The price {VALUE} should be less than the regular price.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.0,
      min: [1, 'rating must be greater than or equal to 1'],
      max: [5, 'rating must be less than or equal to 5'],
    },
    ratingsQuantity: { type: Number, default: 4.0 },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    secretTour: { type: Boolean, default: false },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

toursSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// document middleware: runs before .save() and .create() functions ONLY.
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre('save', (next) => {
//   console.log('will save documnent');
//   next();
// });

// toursSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
  // the regex is to ensure that the query runs for all the find methods like find, findOne, findOneAndDelete, etc.
  this.find({ secretTour: { $ne: true } }); // here, this points to the the current document.
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // here, 'this' points to the current query.
  // console.log(doc);
  next();
});

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
