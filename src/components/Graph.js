import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeeklyReportChart = ({ data }) => {
  const defaultData = [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  console.log(data)// Convert object-like data to array or use default
  const chartData = data ?
    defaultData.map((defaultItem, index) => {
      return data[index] || defaultItem;
    }) :
    defaultData;

  const maxValue = Math.max(...chartData.map(item => item.value)) * 1.2;

  return (
    <View style={styles.container}>
      <View style={styles.chartOuterContainer}>
        <View style={styles.chartContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.backgroundBar}>
                <View
                  style={[
                    styles.valueBar,
                    {
                      height: `${(item.value / maxValue) * 100}%`
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.dayLabelContainer}>
              <Text style={styles.dayLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartOuterContainer: {
    width: '100%',
    height: '100%'
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dayLabelContainer: {
    width: 35,
    alignItems: 'center',
  },
  backgroundBar: {
    width: 25,
    height: 150,
    backgroundColor: '#E5F2F2', // Light green background
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  valueBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 12.5,
    backgroundColor: '#006A6A', // Green for the value bars
  },
  dayLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default WeeklyReportChart;