const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
});

// Hash password before saving the user document
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

 const User = mongoose.model('User', userSchema);
 module.exports=User
