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

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log(`💥Server running on port ${PORT}💥`);
});
