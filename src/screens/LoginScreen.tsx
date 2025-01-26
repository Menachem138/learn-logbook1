import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, SafeAreaView, Image, I18nManager } from 'react-native';
import { supabase } from '../config/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirectUrl = makeRedirectUri({
    scheme: 'learn-logbook'
  });

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
      Alert.alert('שגיאה', 'ההתחברות עם Google נכשלה');
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login')) {
          // Try to sign up if login fails
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) {
            Alert.alert('שגיאה', signUpError.message);
          } else {
            Alert.alert('הצלחה', 'החשבון נוצר בהצלחה! אנא בדוק את האימייל שלך לאימות.');
          }
        } else {
          Alert.alert('שגיאה', error.message);
        }
      }
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בלתי צפויה');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ברוכים הבאים</Text>
          <Text style={styles.subtitle}>קורס קריפטו</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="אימייל"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="סיסמה"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleEmailSignIn}
          >
            <Text style={styles.buttonText}>התחבר</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>או</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.googleButton]}
            onPress={signInWithGoogle}
          >
            <Icon name="google" size={24} color="white" style={styles.googleIcon} />
            <Text style={styles.buttonText}>התחבר עם Google</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'flex-start',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.heading1,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.heading2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    height: 55,
  },
  inputIcon: {
    marginLeft: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: theme.typography.fontSize.body,
    textAlign: 'right',
    color: theme.colors.text.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 55,
    ...theme.shadow.medium,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  buttonText: {
    color: theme.colors.surface.primary,
    fontSize: theme.typography.fontSize.body,
    fontWeight: '600',
  },
  googleIcon: {
    marginRight: theme.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.fontSize.body,
  },
});
