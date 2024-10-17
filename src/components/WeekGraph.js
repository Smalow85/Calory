import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WeeklyReportChart = ({ data, onBarClick, selectedDay }) => {
  const defaultData = [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  // Use the passed data or fallback to default
  const chartData = data ?
    defaultData.map((defaultItem, index) => data[index] || defaultItem) :
    defaultData;

  // Calculate maximum value for scaling
  const maxValue = Math.max(...chartData.map(item => item.value)) || 1;
  const mediumValue = Math.round(maxValue / 2); // Midpoint value

  return (
    <View style={styles.container}>
      <View style={styles.chartOuterContainer}>
        <View style={styles.chartContainer}>
          <View style={styles.barContainer}>
            <View style={styles.yAxisContainer}>
              {/* Vertical line (Y-axis) */}
              <View style={styles.yAxisLine} />
              {/* Render Y-axis labels with only 0, medium, and maximum */}
              <View style={styles.yAxisLabelContainer}>
                <Text style={styles.yAxisLabel}>{maxValue}</Text>
              </View>
              <View style={styles.yAxisLabelContainer}>
                <Text style={styles.yAxisLabel}>{mediumValue}</Text>
              </View>
              <View style={styles.yAxisLabelContainer}>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
            </View>
            <Text style={styles.dayLabel}>{'Count'}</Text>
          </View>
          {chartData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.barContainer}
              onPress={() => onBarClick(item.day)}
            >
              <View style={styles.backgroundBar}>
                <View
                  style={[
                    styles.valueBar,
                    {
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.day === selectedDay ? '#00A3A3' : '#006A6A',
                    }
                  ]}
                />
              </View>
              {/* Align day label with bar */}
              <Text style={[
                styles.dayLabel,
                item.day === selectedDay && styles.selectedDayLabel
              ]}>
                {item.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 25,
    paddingLeft: 0,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxisContainer: {
    justifyContent: 'space-between',
    height: 150,
    alignItems: 'flex-end',
    position: 'relative',
  },
  yAxisLine: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'grey',
  },
  yAxisLabelContainer: {
    alignItems: 'flex-end',
    marginLeft: -10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666'
  },
  chartOuterContainer: {
    flex: 1,
    height: 150,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  backgroundBar: {
    width: 25,
    height: 150,
    backgroundColor: '#E5F2F2',
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  valueBar: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 12.5,
  },
  dayLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedDayLabel: {
    color: '#00A3A3',
    fontWeight: 'bold',
  },
});

export default WeeklyReportChart;