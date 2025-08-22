const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant.js');
const FoodItem = require('./models/FoodItem.js');
const User = require('./models/User.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const sampleRestaurants = [
  {
    name: "Pizza Palace",
    description: "Authentic Italian pizzas and pastas made with love",
    cuisine: "Italian",
    address: "123 Pizza Street, Food City",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    rating: 4.5,
    reviews: 234,
    deliveryTime: 30,
    minOrder: 0,
    deliveryFee: 40
  },
  {
    name: "Burger Hub",
    description: "Gourmet burgers and crispy fries",
    cuisine: "American",
    address: "456 Burger Avenue, Food City",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    rating: 4.2,
    reviews: 156,
    deliveryTime: 25,
    minOrder: 0,
    deliveryFee: 35
  }
];

const sampleFoodItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    ingredients: ["Tomato sauce", "Mozzarella", "Basil"],
    dietaryInfo: { isVegetarian: true, isVegan: false, isGlutenFree: false }
  },
  {
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni with mozzarella cheese",
    price: 399,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    ingredients: ["Tomato sauce", "Mozzarella", "Pepperoni"],
    dietaryInfo: { isVegetarian: false, isVegan: false, isGlutenFree: false }
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();

    // Create restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);

    // Create food items linked to restaurants
    const foodItems = sampleFoodItems.map((item, index) => ({
      ...item,
      restaurant: restaurants[index % restaurants.length]._id
    }));

    await FoodItem.insertMany(foodItems);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();