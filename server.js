const dotenv = require('dotenv');
dotenv.config({path: './config.env'}); // setting the dotenv config before requiring app.

const app = require('./app');

// console.log(app.get('env'));
// process.env.NODE_ENV = 'development';
// console.log(process.env.NODE_ENV);

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log('💥Server running on port ' + PORT + '💥');
});
