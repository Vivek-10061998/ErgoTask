const mongoose = require('mongoose');

//movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

//theatre schema
const theatreSchema = new mongoose.Schema({
  title: {type:String, required:true},
  theatre_name: { type: String, required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
});

//showtime schema
const showtimeSchema = new mongoose.Schema({
  theatre_name:{type:String, required:true},
  showtime: { type:Array, required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }
});

const Movie = mongoose.model('Movie', movieSchema);

const Showtime = mongoose.model('Showtime', showtimeSchema);

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = {Movie,Theatre,Showtime};