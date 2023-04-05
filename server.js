const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Movie, Theatre } = require('./model/movie');

const app = express();

//setup path for '.env' file
dotenv.config();

//Mongodb Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database!!!!'))
    .catch(error => console.error(error));

app.use(express.json());


//get all movies
app.get('/getAllMovies', async (req, res) => {
    try {
        const movies = await Movie.find()
        res.status(200).json(movies);
        console.log(movies)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//movie create
app.post('/movie', async (req, res) => {
    try {
        const { title } = req.body;
        const movie = new Movie({ title });
        await movie.save();
        res.status(201).json({ message: 'Movie Inserted Successfully', movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/theatre/:id', async (req, res) => {
    try {
      const theatre = await Theatre.findById(req.params.id).populate('movie');
      if (!theatre) {
        return res.status(404).json({ error: 'Theatre not found' });
      }
      res.json({ theatre, movie: theatre.movie.title });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  



//get all theatre
app.get('/getAlltheatres', async (req, res) => {
    try {
        const theatre = await Theatre.find()
        res.status(200).json(theatre);
        console.log(theatre)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//theatre create
app.post('/theatre/:movie_id', async (req, res) => {
    try {
        const name = req.body.name;
        const movie_id = req.params.movie_id;
        const movie = await Movie.findById(movie_id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const theatre = new Theatre({ movie_id, name });
        await theatre.populate('movie', 'title').execPopulate();
        await theatre.save();
        res.json(theatre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
