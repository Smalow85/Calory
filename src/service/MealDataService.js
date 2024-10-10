import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, onSnapshot  } from "firebase/firestore";
import { firestore } from '../config/FirebaseConfig';

// Function to add a meal to Firestore
export async function addMeal(mealData) {
  try {
    const docRef = await addDoc(collection(firestore, "meals"), {
      user_id: mealData.user_id,                    // ID of the user who is adding the meal
      dish_type: mealData.dish_type,                // e.g., breakfast, lunch, dinner
      short_description: mealData.short_description, // Short description of the meal
      calories: mealData.calories,                   // Total calories of the meal
      timestamp: serverTimestamp(),                 // Current timestamp
      ingredients: mealData.ingredients,             // List of ingredients
      proteins: mealData.proteins,                   // Protein content
      fats: mealData.fats,                           // Fat content
      carbohydrates: mealData.carbohydrates          // Carbohydrate content
    });
    console.log("Meal added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding meal: ", e);
  }
}

function getStartOfDayTimestamp() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set the time to midnight (start of the day)
  return Timestamp.fromDate(now); // Firestore's Timestamp format
}

// Function to fetch meals by user_id from the start of the day
export async function getMealsForToday(user_id) {
  const startOfDay = getStartOfDayTimestamp(); // Get timestamp for the start of today
  const mealsRef = collection(firestore, "meals");

  // Create a query to get all meals from the start of today for the specific user
  const q = query(
    mealsRef,
    where("user_id", "==", user_id),       // Filter by user_id
    where("timestamp", ">=", startOfDay)   // Filter by meals from the start of the day
  );

  try {
    const querySnapshot = await getDocs(q);
    const meals = [];
    querySnapshot.forEach((doc) => {
      meals.push({
        id: doc.id, // Document ID
        ...doc.data() // Meal data
      });
    });

    console.log("Meals for user:", meals);
    return meals; // Return the list of meals
  } catch (e) {
    console.error("Error fetching meals:", e);
  }
}

export const listenForMealUpdates = (username, callback) => {
  const mealsRef = collection(firestore, 'meals'); // Reference to the 'meals' collection
  const mealsQuery = query(mealsRef, where('user_id', '==', username)); // Query meals where username matches

  // Set up Firestore listener with the new modular syntax
  const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
    const newMeals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(newMeals); // Call the provided callback with the new meal data
  });

  // Return the unsubscribe function to stop listening
  return unsubscribe;
};

export async function fetchMealsForLastWeek(username) {
  try {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const todayTimestamp = Timestamp.fromDate(today);
    const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

    const mealsRef = collection(firestore, 'meals'); // Reference to 'meals' collection

    // Query for meals in the last week for this specific user
    const mealsQuery = query(
      mealsRef,
      where('telegramUserId', '==', username),
      where('timestamp', '>=', oneWeekAgoTimestamp),
      where('timestamp', '<=', todayTimestamp)
    );

    console.log(mealsQuery)
    const snapshot = await getDocs(mealsQuery);


    // Map data to array of { timestamp, calories } objects
    const meals = snapshot.docs.map(doc => ({
      date: doc.data().timestamp.toDate(),  // Convert Firestore Timestamp to JS Date
      calories: doc.data().calories
    }));

    return meals;
  } catch (error) {
    console.error('Error fetching meals for the last week:', error);
    return [];
  }
}

export function groupMealsByDay(meals) {
  const caloriesByDay = {};

  meals.forEach(meal => {
    const dateKey = meal.date.toLocaleDateString(); // Get date in 'YYYY-MM-DD' format
    if (!caloriesByDay[dateKey]) {
      caloriesByDay[dateKey] = 0;
    }
    caloriesByDay[dateKey] += meal.calories;  // Sum calories for each day
  });
  console.log(caloriesByDay)

  return caloriesByDay;
}