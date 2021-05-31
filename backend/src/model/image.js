const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  likes: [],
  upvotes: [],
  image: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
});

ImageSchema.pre('findOneAndUpdate', next => {
  console.log('pre update hook');
  next();
});

module.exports = mongoose.model('image', ImageSchema);
