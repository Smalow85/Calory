const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const generateRandomMealData = (userId) => {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const randomMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];

  return {
    user_id: userId,
    dish_type: randomMealType,
    short_description: `A delicious ${randomMealType.toLowerCase()}.`,
    calories: Math.floor(Math.random() * 1000) + 100, // Random calories between 100 and 1000
    timestamp: new Date().toISOString(),
    ingredients: ['Ingredient1', 'Ingredient2', 'Ingredient3'],
    proteins: Math.floor(Math.random() * 50), // Random protein content
    fats: Math.floor(Math.random() * 30), // Random fat content
    carbohydrates: Math.floor(Math.random() * 100), // Random carbs content
  };
};

// Mock endpoint to analyze meal image
app.post('/api/analyze-meal', (req) => {
  const { userId } = req.body;

  // Generate and return random meal data
  const mealData = generateRandomMealData(userId);

  res.json(mealData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
