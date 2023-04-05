const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Movie, Theatre, Showtime, Ticket } = require('./model/movie');
const ObjectId = require('mongodb').ObjectId;
const authRoutes = require('./route/auth');
const userRoutes = require('./route/user');
const { authenticate } = require('./route/middleware');

const app = express();

//setup path for '.env' file
dotenv.config();

//Mongodb Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database!!!!'))
  .catch(error => console.error(error));

app.use(express.json());

app.use(express.json());

//User authentication routing
app.use('/users', authRoutes);

//crud operation routing
app.use('/users', userRoutes);

// Get all users (requires authentication)
app.get('/users', authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//port
app.get('/', (req, res) => {
  res.send('welcome to Book my show!!!')
});

//get all movies(to see all the movies playing in your city)
app.get('/getAllMovies', async (req, res) => {
  try {
    const movies = await Movie.find()
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//movie create API(For Admin use)
app.post('/movie' ,async (req, res) => {
  try {
    const { title } = req.body;
    const movie = await Movie({ title });
    await movie.save();
    res.status(201).json({ message: 'Movie Inserted Successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//book ticket API(for logged in user only)
app.post('/book-ticket',authenticate, async (req, res) => {
  try {
    const { title, theatre_name, showtime } = req.body;

    // Check if the movie exists in the Movie collection
    const movie = await Movie.findOne({ title });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the theatre exists in the Theatre collection
    const theatre = await Theatre.findOne({ theatre_name });
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    // Check if the specified showtime is in the Showtime array for the specified theatre name
  
    const show_time = await Showtime.findOne( { theatre_name, showtime });
    
    if (!show_time) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Create a new ticket in the Ticket collection
    const ticket = new Ticket({
      movie: movie._id,
      theatre: theatre._id,
      showtime: showtime
    });

    await ticket.save();
    res.status(200).json({ message: 'Ticket booked successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all theatres in your city along with the movie name and showtimings

app.get('/getAllTheatre', authenticate, async (req, res) => {

  try {
    const movie = await Movie.aggregate([
      {
        $lookup: {
          from: 'theatres',
          localField: 'title',
          foreignField: 'title',
          as: 'theatre_info'
        }
      },
      {
        $lookup: {
          from: 'showtimes',
          localField: 'theatre_info.theatre_name',
          foreignField: 'theatre_name',
          as: 'showtime_info'
        }
      },
      {
        $project: {
          _id: 0,
          movie_id: '$_id',
          title: 1,
          'theatre_name': '$theatre_info.theatre_name',
          'showtime': '$showtime_info.showtime'
        }
      }
    ]);

    if (movie.length > 0) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




//theatre create(Admin use only)
app.post('/theatre/:movie_id', async (req, res) => {
  try {
    const { theatre_name, title } = req.body;
    const movie_id = req.params.movie_id;
    const movie = await Movie.findById(movie_id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const theatre = await Theatre({
      movie: movie._id,
      movie_id,
      theatre_name,
      title
    });
    await theatre.save();
    res.json(theatre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//showtime create(Admin use only)
app.post('/showtime/:movie_id', async (req, res) => {
  try {
    const { theatre_name, showtime } = req.body;
    const movie_id = req.params.movie_id;
    const movie = await Movie.findById(movie_id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const show_time = await Showtime({
      movie: movie._id, 
      movie_id,
      theatre_name,
      showtime
    });
    await show_time.save();
    res.json(show_time);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});