const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
  })
  .then(() => {
    console.log('db connected successfully 💛');
  });

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', toursSchema);

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log(`💥Server running on port ${PORT}💥`);
});
