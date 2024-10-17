import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import NutrientsStats from '../components/NutrientsStats';
import WeeklyReportChart from '../components/WeekGraph';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/FirebaseConfig';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Statistics = ({ navigation }) => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mealsByDay, setMealsByDay] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const route = useRoute();
  const { userId } = route.params;

  useEffect(() => {
    fetchWeekData(currentWeekStart);
  }, [currentWeekStart]);

  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  const fetchWeekData = async (startDate) => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      const mealsRef = collection(firestore, 'meals');
      const q = query(
        mealsRef,
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<', endTimestamp),
        where('user_id', '==', userId)
      );

      const querySnapshot = await getDocs(q);

      const mealsData = {};
      const dailyTotals = {
        'Mon': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Tue': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Wed': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Thu': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Fri': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Sat': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
        'Sun': { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0 },
      };

      querySnapshot.forEach(doc => {
        const mealData = doc.data();
        const date = mealData.timestamp.toDate();
        const dayKey = date.toLocaleString('en-US', { weekday: 'short' });

        if (!mealsData[dayKey]) {
          mealsData[dayKey] = [];
        }

        mealsData[dayKey].push(mealData);

        dailyTotals[dayKey].totalCalories += mealData.calories || 0;
        dailyTotals[dayKey].fats += mealData.fats || 0;
        dailyTotals[dayKey].proteins += mealData.proteins || 0;
        dailyTotals[dayKey].carbohydrates += mealData.carbohydrates || 0;
      });

      const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const chartData = daysOrder.map(day => ({
        day,
        value: Math.round(dailyTotals[day].totalCalories || 0),
        fats: Math.round(dailyTotals[day].fats || 0),
        proteins: Math.round(dailyTotals[day].proteins || 0),
        carbohydrates: Math.round(dailyTotals[day].carbohydrates || 0),
      }));

      setWeeklyData(chartData);
      setMealsByDay(mealsData);

      // Set the current day as the default selected day
      const today = new Date().toLocaleString('en-US', { weekday: 'short' });
      setSelectedDay(today);

    } catch (error) {
      console.error("Error fetching meal data:", error);
      setError("Failed to fetch meal data");
    } finally {
      setLoading(false);
    }
  };

  const handleBarClick = (day) => {
    setSelectedDay(day);
  };

  const getSelectedDayData = () => {
    if (!weeklyData || !selectedDay) return { totalCalories: 0, fats: 0, proteins: 0, carbohydrates: 0, meals: [] };

    const dayData = weeklyData.find(item => item.day === selectedDay);

    return {
      totalCalories: dayData ? dayData.value : 0,
      fats: dayData ? dayData.fats : 0,
      proteins: dayData ? dayData.proteins : 0,
      carbohydrates: dayData ? dayData.carbohydrates : 0,
      meals: mealsByDay[selectedDay] || [],
    };
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(getMonday(newDate));
  };

  const formatWeekRange = (startDate) => {
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    const options = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
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

  const { totalCalories, fats, proteins, carbohydrates, meals } = getSelectedDayData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          /*<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>*/
          <View style={styles.weekNavigator}>
            /*<TouchableOpacity onPress={() => navigateWeek(-1)}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>*/
            <Text style={styles.weekText}>{formatWeekRange(currentWeekStart)}</Text>
            /*<TouchableOpacity onPress={() => navigateWeek(1)}>
                <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>*/
          </View>
        </View>
        <View style={styles.calorieCard}>
          <WeeklyReportChart style={styles.graph} data={weeklyData} onBarClick={handleBarClick} selectedDay={selectedDay} />
        </View>
        <NutrientsStats fats={fats} proteins={proteins} carbohydrates={carbohydrates} />
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
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  weekNavigator: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16, // Add some space between the header text and week navigator
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  },
});