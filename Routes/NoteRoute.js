const mongoose = require('mongoose');
const { noteValidator } = require('../utils/validators');

const Note = mongoose.model('Notes');

//New note
exports.postNewNote = (req, res) => {
  const { body } = req.body;

  const newNote = {
    username: req.user.username,
    body,
    archived: false,
    done: false,
  };

  const { errors, valid } = noteValidator(newNote);

  if (!valid) {
    return res.status(403).send(errors);
  }

  const note = new Note(newNote);
  note
    .save()
    .then((data) => {
      return res.status(200).send({ data });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ error: `internal server error: ${err.message}` });
    });
};

//get notes
exports.getUserNotes = (req, res) => {
  Note.find({
    username: req.user.username,
    archived: false,
  })
    .sort({ createdAt: -1 })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

//get archived notes
exports.getUserArchivedNotes = (req, res) => {
  Note.find({
    username: req.user.username,
    archived: true,
  })
    .sort({ createdAt: -1 })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

//get done notes
exports.getUserDoneNotes = (req, res) => {
  Note.find({
    username: req.user.username,
    done: true,
    archived: false,
  })
    .then((doc) => {
      res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `Internal server error: ${err}` });
    });
};

//archive a note
exports.noteArchive = (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { archived: true } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

//unarchive a note
exports.noteUnarchive = (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { archived: false } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

//mark note done
exports.markNoteDone = (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { done: true, archived: false } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

//mark note undone
exports.markNoteUndone = (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { done: false } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

exports.deleteNote = (req, res) => {
  Note.findByIdAndDelete({ _id: req.params.id })
    .then(() => {
      return res.status(200).send({ message: 'Note Deleted' });
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};

exports.editNote = (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { body: req.body.body } },
    { returnOriginal: false }
  )
    .then((doc) => {
      return res.status(200).send(doc);
    })
    .catch((err) => {
      return res.status(500).send({ error: `internal server error: ${err}` });
    });
};
