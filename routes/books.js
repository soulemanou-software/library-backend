const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getCategories
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/categories', getCategories);

router
  .route('/')
  .get(getBooks)
  .post(
    protect,
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('author').notEmpty().withMessage('Author is required'),
      body('isbn').notEmpty().withMessage('ISBN is required'),
      body('category').notEmpty().withMessage('Category is required')
    ],
    createBook
  );

router
  .route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;
