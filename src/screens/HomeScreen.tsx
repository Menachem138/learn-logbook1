import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { useAuth } from '../components/auth/AuthProvider';
import { ConfigTest } from '../components/ConfigTest';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>ברוך הבא</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Timer')}
          >
            <Icon name="timer-outline" size={32} color="#4285F4" />
            <Text style={styles.menuText}>טיימר למידה</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Journal')}
          >
            <Icon name="notebook-outline" size={32} color="#4285F4" />
            <Text style={styles.menuText}>יומן למידה</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Course')}
          >
            <Icon name="book-open-variant" size={32} color="#4285F4" />
            <Text style={styles.menuText}>תוכן הקורס</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('WeeklySchedule')}
          >
            <Icon name="calendar-clock" size={32} color="#4285F4" />
            <Text style={styles.menuText}>לוח זמנים</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Documents')}
          >
            <Icon name="file-document-outline" size={32} color="#4285F4" />
            <Text style={styles.menuText}>מסמכים</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Assistant')}
          >
            <Icon name="robot" size={32} color="#4285F4" />
            <Text style={styles.menuText}>עוזר אישי</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('NotificationTest')}
          >
            <Icon name="bell-outline" size={32} color="#4285F4" />
            <Text style={styles.menuText}>התראות</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={signOut}
        >
          <Icon name="logout" size={24} color="white" style={styles.signOutIcon} />
          <Text style={styles.signOutText}>התנתק</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'flex-end',
  },
  welcome: {
    fontSize: theme.typography.fontSize.heading1,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  email: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.small,
  },
  menuText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    ...theme.shadow.medium,
  },
  signOutIcon: {
    marginRight: theme.spacing.sm,
  },
  signOutText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: '600',
  },
});
