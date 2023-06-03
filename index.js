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
    Title: 'Inception',
    Description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    Genre: {
      Name: 'Adventure',
    },
    Director: {
      Name: 'Christopher Nolan',
      Bio: 'Chris bio'
    },
  },
  {
    Title: 'The Departed',
    Description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
    Genre: {
      Name: 'Thriller',
    },
    Director: {
      Name: 'Martin Scorcese ',
      Bio: 'Martin bio'
    },
  },
  {
    Title: 'Catch me if you can',
    Description: 'Barely 21 yet, Frank is a skilled forger who has passed as a doctor, lawyer and pilot. FBI agent Carl becomes obsessed with tracking down the con man, who only revels in the pursuit.',
    Genre: {
      Name: 'Drama',
    },
    Director: {
      Name: 'Stephen Spielburg',
      Bio: 'Steve bio'
    },
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
  res.sendFile('public/documentation.html', { root: __dirname }); //server
});

app.get('/movies', (req, res) => {
  res.status(200).json(favMovies);
});

//app get directors

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = favMovies.find ( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
}),

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = favMovies.find ( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
}),

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = favMovies.find ( movie => movie.Directorector.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
}),

app.get('/users', (req, res) => {
  res.send('Successful GET request returning data on all the users');
});

// Adds data for a new user to our list.
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

// Deletes a user from our list by ID
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