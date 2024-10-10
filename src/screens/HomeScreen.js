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
import CircularProgress from '../components/CircularRing';
import { BASE_COLOR } from './Constants';
import { config } from '../../config';
import ImagePickerComponent from '../components/ImagePicker';
import { fetchOrCreateUserByTelegramId } from '../service/UserCreationService';
import { getMealsForToday, listenForMealUpdates } from '../service/MealDataService';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const [currentCalories, setCurrentCalories] = useState(0);
  const [caloriesBudget, setCaloriesBudget] = useState(2000); // State for calories budget
  const [userData, setUserData] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]); // Add state for recent meals
  const { username } = config().initDataUnsafe.user;
  const userInfo = { name: username };
  const [loading, setLoading] = useState(true);

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
                      <CircularProgress currentValue={currentCalories} maxValue={caloriesBudget} /> // Adjust maxValue as needed
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
          {recentMeals.length > 0 ? ( // Check if there are meals
            recentMeals.map(meal => (
              <View key={meal.id} style={styles.mealItem}>
                <Text style={styles.mealName}>{meal.dish_type + '/' + meal.short_description}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              </View>
            ))
          ) : (
            <Text>No meals recorded today.</Text> // Display message if no meals
          )}
        </ScrollView>
      </View>

      <View>
        <ImagePickerComponent user_id={username}/>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    flex: 1,
    backgroundColor: '#006A6A',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#006A6A',
  },
  secondaryButtonText: {
    color: '#006A6A',
  },
});