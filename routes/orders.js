const express = require('express');
const Order = require('../models/Order.js');
const { auth } = require('../middleware/auth.js');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, specialInstructions } = req.body;
    
    // Calculate total amount
    let totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalAmount = totalAmount + 40 + (totalAmount * 0.05); // Delivery fee + tax

    const order = new Order({
      user: req.user._id,
      restaurant,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.address,
      specialInstructions
    });

    await order.save();
    await order.populate('restaurant', 'name').populate('items.foodItem', 'name price');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name')
      .populate('items.foodItem', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name address')
      .populate('items.foodItem', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;