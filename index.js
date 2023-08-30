const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
methodOverride = require('method-override');
const app = express()
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movies;//case sensative?
const Users = Models.Users;//Import

mongoose.connect('mongodb://127.0.0.1:27017/FliXDB', { useNewUrlParser: true, useUnifiedTopology: true });
//local host


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan())

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()//file from database
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get movie title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.status(200).json(movie);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get movie genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Genre.Name': req.params.genreName }).then((movie) => {
    res.status(200).json(movie);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director by name
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { directorName } = req.params;
  await Movies.findOne({ 'Director.Name': directorName }).then((movie) => {
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).send('No movies with this director.')
    }
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username }) // User
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a user
app.post('/users', (req, res) => {
  Users.findOne({ name: req.body.Username })//auth?
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        const hashPassword = Users.hashPassword(req.body.Password)
        Users
          .create({
            Username: req.body.Username,
            Password: hashPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userToUpdate = {}
  if (req.body.Pasword) {
    const hashPassword = Users.hashPassword(req.body.Password)
    userToUpdate.Password = hashPassword
  }
  if (req.body.Email) {
    userToUpdate.Email = req.body.Email
  }
  if (req.body.Birthday) {
    userToUpdate.Birthday = req.body.Birthday
  }

  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set: userToUpdate
  },
    { new: true }, // This line makes sure that the updated document is returned
  ).then(updatedUser => {
    res.json(updatedUser);
  }).catch(error => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID } //enter FavMovies
  },
    { new: true }, // This line makes sure that the updated document is returned
  ).then(updatedUser => {
    res.json(updatedUser);
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

// Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send('Error: User not found');
      } else {
        res.json(updatedUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});