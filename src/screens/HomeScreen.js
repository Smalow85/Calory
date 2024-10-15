import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import CircularProgress from '../components/CircularProgress';
import { BASE_COLOR } from './Constants';
import { config } from '../../config';
import { fetchOrCreateUserByTelegramId } from '../service/UserCreationService';
import { getMealsForToday, listenForMealUpdates } from '../service/MealDataService';
import { analyzeMealImage } from '../service/OpenAIVisionService';
import MealCard from '../components/MealCard'

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const [currentCalories, setCurrentCalories] = useState(0);
  const [caloriesBudget, setCaloriesBudget] = useState(2000); // State for calories budget
  const [userData, setUserData] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]); // Add state for recent meals
  const { username } = config().initDataUnsafe.user;
  const userInfo = { name: username };
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const openGallery = () => {
          document.getElementById('fileInput').click();
  };

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUri = URL.createObjectURL(file);
        try {
          navigation.navigate('screens/FoodDetailsScreen', { userId: username, imageUri: imageUri });
        } catch (error) {
          console.error('Error processing meal image: ', error);
        }
      }
    };

  useEffect(() => {
    const handleUser = async () => {
      try {
        const user = await fetchOrCreateUserByTelegramId(username, userInfo);
        setUserData(user);
        setCaloriesBudget(parseInt(user.caloriesBudget, 10));
      } catch (error) {
        console.error('Error handling user: ', error);
      }
    };

    const fetchMeals = async () => {
      try {
        const meals = await getMealsForToday(username); // Assuming this function returns meals
        setRecentMeals(meals);
        const total = meals.reduce((sum, meal) => sum + meal.calories, 0);
        setCurrentCalories(total);// Set the recent meals in the state
      } catch (error) {
        console.error('Error fetching meals: ', error);
      }
    };

    handleUser();
    fetchMeals();
    const unsubscribe = listenForMealUpdates(username, newMeals => {
          setRecentMeals(newMeals); // Update the recent meals state when new meals are added
          const total = newMeals.reduce((sum, meal) => sum + meal.calories, 0);
          setCurrentCalories(total);
        });
    setLoading(false);
    return () => unsubscribe();
  }, [username]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Text
                style={styles.menuIcon}
                onPress={() => navigation.navigate('screens/Settings', { userId: username })}
            >☰</Text>
          </TouchableOpacity>
          <Text style={styles.greeting}>Hello, {username}</Text>
          <View style={styles.avatarPlaceholder} />
        </View>

        <View style={styles.calorieCard}>
          <Text style={styles.cardTitle}>Calories Budget</Text>
          {loading ? ( // Show loading indicator while data is fetching
                      <Text>Loading...</Text>
                    ) : (
                      <CircularProgress currentValue={currentCalories} maxValue={caloriesBudget} radius={90}/> // Adjust maxValue as needed
                    )
          }
          <View style={styles.statusContainer}>
            <TouchableOpacity style={styles.analysisButton}>
              <Text
                style={styles.analysisText}
                onPress={() => navigation.navigate('screens/Statistics', { userId: username })}
              >
                My statistics
              </Text>
            </TouchableOpacity>
            {currentCalories < caloriesBudget
                ? <View style={styles.statusPill}>
                        <Text style={styles.statusText}>ON TARGET</Text>
                  </View>
                : <View style={styles.statusPillOutOfBudget}>
                        <Text style={styles.statusText}>OUT OF TARGET</Text>
                </View>
            }
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.recentMealsSection}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {recentMeals.length > 0 ? (
            recentMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))
          ) : (
            <Text>No meals recorded today.</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.floatingButton} onPress={openGallery}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    width: screenWidth,
    paddingBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuIcon: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  calorieCard: {
    backgroundColor: BASE_COLOR,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  analysisText: {
    color: 'white',
    fontSize: 16,
  },
  statusPill: {
    backgroundColor: '#004D4D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPillOutOfBudget: {
    backgroundColor: '#b03912',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  recentMealsSection: {
    flexGrow: 1, // Allow the ScrollView to grow and take remaining space
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 16,
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#006A6A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For shadow effect on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.2, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
});
