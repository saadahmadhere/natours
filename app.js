const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express()

// MIDDLEWARES
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev')); // this is to get the logger (like GET /api/v1/tours 200 6.176 ms - 8817)
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // this middleware sets this as route when any of the defined routes cannot be found. So, if we haven't defined any routes /public, this middleware will put it as the default route.

app.use((req, res, next) => {
  console.log('Hello from the middleware 🙋‍♀️');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
