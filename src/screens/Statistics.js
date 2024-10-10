import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import WeeklyReportChart from '../components/Graph';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/FirebaseConfig'; // Adjust the import based on your project structure
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icon library

const screenWidth = Dimensions.get('window').width;

const Statistics = ( { navigation }) => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    fetchLastWeekData();
  }, []);

  const fetchLastWeekData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const startTimestamp = Timestamp.fromDate(lastWeek);
        const endTimestamp = Timestamp.fromDate(today);

        const mealsRef = collection(firestore, 'meals');
        const q = query(
          mealsRef,
          where('timestamp', '>=', startTimestamp),
          where('timestamp', '<=', endTimestamp),
          where('user_id', '==', userId)
        );

        const querySnapshot = await getDocs(q);

        // Create an object to store meals by date
        const mealsByDate = {};

        querySnapshot.forEach(doc => {
          const mealData = doc.data();
          const date = mealData.timestamp.toDate();
          const dayKey = date.toISOString().split('T')[0]; // Use YYYY-MM-DD as key

          if (!mealsByDate[dayKey]) {
            mealsByDate[dayKey] = {
              dayName: date.toLocaleString('en-US', { weekday: 'short' }),
              totalCalories: 0,
              meals: []
            };
          }

          mealsByDate[dayKey].meals.push(mealData);
          mealsByDate[dayKey].totalCalories += mealData.calories || 0;
        });

        // Initialize daily totals with 0 for all days
        const dailyTotals = {
          'Mon': 0,
          'Tue': 0,
          'Wed': 0,
          'Thu': 0,
          'Fri': 0,
          'Sat': 0,
          'Sun': 0
        };

        // Sum up calories for each day
        Object.values(mealsByDate).forEach(dayData => {
          dailyTotals[dayData.dayName] = dayData.totalCalories;
        });

        // Convert to the format needed for the chart
        const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const chartData = daysOrder.map(day => ({
          day,
          value: Math.round(dailyTotals[day] || 0)
        }));

        setWeeklyData(chartData);

        // For debugging
        console.log('Meals by date:', mealsByDate);
        console.log('Chart data:', chartData);

      } catch (error) {
        console.error("Error fetching meal data:", error);
        setError("Failed to fetch meal data");
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
  <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                      <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Settings</Text>
            </View>
            <View style={styles.calorieCard}>
              <WeeklyReportChart style={styles.graph} data={weeklyData} />
            </View>
        </View>
  </SafeAreaView>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  calorieCard: {
    backgroundColor: '#ddd',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  graph: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 16,
  }
});