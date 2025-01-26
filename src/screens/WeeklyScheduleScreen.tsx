import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const DEFAULT_SCHEDULE = [
  { time: '16:00–16:15', activity: 'הכנה מנטלית ופיזית' },
  { time: '16:15–17:00', activity: 'צפייה בפרק מהקורס וסיכומים' },
  { time: '17:00–17:10', activity: 'הפסקת ריענון קצרה' },
  { time: '17:10–18:00', activity: 'תרגול מעשי' },
  { time: '18:00–18:10', activity: 'הפסקה קצרה נוספת' },
  { time: '18:10–19:00', activity: 'חזרה על החומר וכתיבת שאלות פתוחות' },
];

const DAYS = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת',
];

export default function WeeklyScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(1); // Monday (שני) by default

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>לוח זמנים שבועי</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
        {DAYS.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayButtonText,
              selectedDay === index && styles.selectedDayButtonText,
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scheduleContainer}>
        {DEFAULT_SCHEDULE.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.activityContainer}>
              <Text style={styles.activityText}>{item.activity}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>הוסף משימה</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  daysContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDayButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  selectedDayButtonText: {
    color: '#ffffff',
  },
  scheduleContainer: {
    flex: 1,
    padding: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  timeContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: 120,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  activityContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'right',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
