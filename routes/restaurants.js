const express = require('express');
const Restaurant = require('../models/Restaurant.js');
const FoodItem = require('../models/FoodItem.js');
const { auth, adminAuth } = require('../middleware/auth.js');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, search, minRating } = req.query;
    let filter = { isActive: true };

    if (cuisine) filter.cuisine = new RegExp(cuisine, 'i');
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { cuisine: new RegExp(search, 'i') }
      ];
    }

    const restaurants = await Restaurant.find(filter);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant menu
router.get('/:id/menu', async (req, res) => {
  try {
    const menu = await FoodItem.find({
      restaurant: req.params.id,
      isAvailable: true
    }).populate('restaurant', 'name');
    
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create restaurant (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;