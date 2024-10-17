import axios from 'axios';

//const OPENAI_VISION_API_URL = 'https://api.openai.com/v1/vision';
const OPENAI_VISION_API_URL = 'https://cors-anywhere.herokuapp.com/https://api.openai.com/v1/vision';

const OPENAI_API_KEY = 'demo'; // Replace with your OpenAI API Key

export const analyzeMealImage = async (userId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'meal_image.jpg'
    });

    const response = await axios.post('http://localhost:8080/analyze', {
          userId,
          imageUri
    });

    const mealData = response.data; // Parse the API response to get meal data

    // Format the mealData based on the structure you want
    const formattedMealData = {
      user_id: userId,
      dish_type: mealData.dish_type,
      short_description: mealData.short_description,
      calories: mealData.calories,
      timestamp: new Date(), // or serverTimestamp(), depending on backend
      ingredients: mealData.ingredients,
      proteins: mealData.proteins,
      fats: mealData.fats,
      carbohydrates: mealData.carbohydrates,
    };

    return formattedMealData;
  } catch (error) {
    console.error('Error analyzing meal image: ', error);
    throw error;
  }
};