const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
methodOverride = require('method-override');
const app = express()

let users = [
  {

  }
]

let favMovies = [
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'The Departed',
    director: 'Martain Scorcese'
  },
  {
    title: 'Catch me if you can',
    director: 'Stephen Spielberg'
  }
];

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


//Middleware 
app.use(express.static('public')); // Location?
app.use(express.json());

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(favMovies);
});


// listen for requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)