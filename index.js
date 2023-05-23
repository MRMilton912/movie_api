const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
methodOverride = require('method-override');
const app = express()

let users = [
  {
    id: 1,
    name: 'Jessica',
    favoriteMovie: []
  },

  {
    id: 2,
    name: 'Ben',
    favoriteMovie: []
  },
  {
    id: 3,
    name: 'Lisa',
    favoriteMovie: []
  }
];


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

app.get('/users', (req, res) => {
  res.send('Successful GET request returning data on all the users');
});

// Adds data for a new student to our list of users.
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Deletes a student from our list by ID
app.delete('/users/:id', (req, res) => {
  let student = users.find((student) => { return student.id === req.params.id });

  if (student) {
    users = users.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Student ' + req.params.id + ' was deleted.');
  }
});


// listen for requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)