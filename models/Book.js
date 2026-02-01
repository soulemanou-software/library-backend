const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science',
      'Technology',
      'History',
      'Biography',
      'Self-Help',
      'Children',
      'Mystery',
      'Romance',
      'Fantasy',
      'Other'
    ]
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Year must be valid'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot be more than 100 characters']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  language: {
    type: String,
    default: 'English'
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/150x200?text=No+Cover'
  },
  available: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [0, 'Quantity cannot be negative']
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

BookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', BookSchema);
