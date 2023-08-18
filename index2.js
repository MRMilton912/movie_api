
//movies.find().then((movies) => {
// Logic here??
//});

//app.get.movies.find({});//!??

//app.get('/movies', (req, res) => {
//  res.status(200).json(movies);
//});

//app.get('/movies', (req, res) => {
//  movies.find().then(movies => res.json(movies));
//});


// app.get('/movies/director/:directorName', (req, res) => {
// const { directorName } = req.params;
//    const director = Movies.find(movie => movie.Directorector.Name === directorName).Director;

//    if (director) {
//    res.status(200).json(director);
//  } else {
//  res.status(400).send('no such director')
//  }
// }),

//app.get('/users', (req, res) => {
//  res.send('Successful GET request returning data on all the users');
//});



// Add a movie to a user's list of favorites
//app.post('/users/:Username/movies/:MovieID', (req, res) => {
//	Users.findOneAndUpdate(
//		{ Username: req.params.Username },
//		{
//			$addToSet: { FavoriteMovies: req.params.MovieID },
//		},
//		{ new: true }
//	)
//		.then((updatedUser) => {
//			if (!updatedUser) {
//				return res.status(404).send('Error: User was not found');
//			} else {
//				res.json(updatedUser);
//			}
//		})
//		.catch((error) => {
//			console.error(error);
//			res.status(500).send('Error: ' + error);
//		});
//});


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

app.post('/users', (req, res) => {
  Users.findOne({ name: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

app.post('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ name: req.body.Username }) //Username
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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