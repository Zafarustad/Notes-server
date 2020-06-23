require('./Models/User');
require('./Models/Notes');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { signup, login, getAuthenticatedUser } = require('./Routes/AuthRoutes');
const {
  postNewNote,
  getUserNotes,
  getUserArchivedNotes,
  getUserDoneNotes,
  noteArchive,
  noteUnarchive,
  markNoteDone,
  markNoteUndone,
  deleteNote,
} = require('./Routes/NoteRoute');
const { authToken } = require('./utils/AuthToken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB database connection established succesfully');
});

connection.on('error', (err) => {
  console.log(`MongoDB error: ${err}`);
});

//User endpoints
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', authToken, getAuthenticatedUser);

//Notes endpoint
app.post('/note', authToken, postNewNote);
app.get('/note', authToken, getUserNotes);
app.get('/archive/note', authToken, getUserArchivedNotes);
app.get('/done/note', authToken, getUserDoneNotes);
app.put('/archive/:id', authToken, noteArchive);
app.put('/unarchive/:id', authToken, noteUnarchive);
app.put('/done/:id', authToken, markNoteDone);
app.put('/undone/:id', authToken, markNoteUndone);
app.delete('/note/:id', authToken, deleteNote);

app.listen(port, () => {
  console.log(`server is listening to port: ${port}`);
});
