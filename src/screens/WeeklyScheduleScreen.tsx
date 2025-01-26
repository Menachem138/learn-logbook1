import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

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
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.heading3,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  daysContainer: {
    backgroundColor: theme.colors.surface.secondary,
    paddingVertical: theme.spacing.sm,
  },
  dayButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedDayButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayButtonText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  selectedDayButtonText: {
    color: theme.colors.surface.primary,
  },
  scheduleContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  scheduleItem: {
    flexDirection: 'row-reverse', // RTL support
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.shadow.small,
  },
  timeContainer: {
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.md, // RTL support
    borderBottomLeftRadius: theme.borderRadius.md, // RTL support
    width: 120,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  activityContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  addButton: {
    flexDirection: 'row-reverse', // RTL support
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  addButtonText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semiBold,
    marginRight: theme.spacing.sm, // RTL support
  },
});
