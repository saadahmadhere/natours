const app = require('./app');

// console.log(app.get('env'));
process.env.NODE_ENV = 'development';
console.log(process.env);

const PORT = 8000;

app.listen(PORT, () => {
  console.log('💥Server running on port ' + PORT + '💥');
});
