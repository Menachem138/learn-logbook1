import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { useAuth } from '../components/auth/AuthProvider';
import { ConfigTest } from '../components/ConfigTest';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 40,
    alignItems: 'flex-end',
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutIcon: {
    marginRight: 10,
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
