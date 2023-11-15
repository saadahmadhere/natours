const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // this is to get the logger (like GET /api/v1/tours 200 6.176 ms - 8817)
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // this middleware sets this as route when any of the defined routes cannot be found. So, if we haven't defined any routes /public, this middleware will put it as the default route.

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant't find ${req.originalUrl} on this server.`,
  // });

  // const err = new Error(`Cant find ${req.originalUrl} on this server.`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Cant find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
