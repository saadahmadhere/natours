const mongoose = require('mongoose');
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    slug: String,
    rating: { type: Number, default: 4.5 },
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
    },
    ratingsAverage: { type: Number, default: 4.0 },
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
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
