const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All favorite routes require authentication
router.use(protect);

router.get('/', getUserFavorites);
router.get('/check/:propertyId', checkFavorite);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);

module.exports = router;
