const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({ path: './config.env' }); // setting the dotenv config before requiring app.

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connected successfully 💛');
  });

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//     console.log('test tour saved㊗🚳');
//   })
//   .catch((err) => {
//     console.log('error saving tour 🔴', err);
//   });

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log(`💥Server running on port ${PORT}💥`);
});
