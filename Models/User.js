const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

signupSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      return next();
    });
  });
});

signupSchema.methods.comparePassword = function (canditatePassword) {
  const user = this;
  let match;
  bcrypt.compare(canditatePassword, user.password).then((result) => {
    result = match;
  });
  return match;
};

mongoose.model('Users', signupSchema);

// signupSchema.methods.comparePassword = function (canditatePassword) {
//   return new Promise(async (resolve, reject) => {
//     bcrypt.compare(canditatePassword, this.password, (err, isMatch) => {
//       if (err) {
//         return reject(err);
//       }
//       if (!isMatch) {
//         console.log('not matched', err);

//         return reject(err);
//       } else {
//         console.log('sjbdj');

//         return resolve(true);
//       }
//     });
//   });
// };
