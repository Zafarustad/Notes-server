const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    archived: {
      type: Boolean,
      required: true,
    },
    done: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model('Notes', noteSchema);
