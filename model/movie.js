
const mongoose = require('mongoose');
//movie schema

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true }
});
const Movie = mongoose.model('Movie', movieSchema);
//theatre schema

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }
});
//showtime schema

const showtimeSchema = new mongoose.Schema({
  showtime: { type: String, required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = {Movie,Theatre,Showtime};
