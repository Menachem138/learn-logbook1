import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { commonStyles } from '../theme/components';

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // TODO: Implement actual chat functionality if requested by user
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>עוזר אישי</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.isUser ? styles.userMessageBubble : styles.assistantMessageBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.isUser ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="שאל את העוזר האישי שלך..."
          placeholderTextColor={theme.colors.text.secondary}
          value={message}
          onChangeText={setMessage}
          multiline
          textAlign="right"
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Icon 
            name="send" 
            size={24} 
            color={message.trim() ? theme.colors.primary : theme.colors.text.secondary}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.heading3,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageWrapper: {
    marginVertical: theme.spacing.xs,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-start',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.medium,
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: theme.borderRadius.sm, // RTL: user messages appear on right
  },
  assistantMessageBubble: {
    backgroundColor: theme.colors.surface.secondary,
    borderTopLeftRadius: theme.borderRadius.sm, // RTL: assistant messages appear on left
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    fontSize: theme.typography.fontSize.body,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  userMessageText: {
    color: theme.colors.surface.primary,
    textAlign: 'left',
    fontWeight: '500',
  },
  assistantMessageText: {
    color: theme.colors.text.primary,
    textAlign: 'right',
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    maxHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    transform: [{ scaleX: -1 }], // Flip icon for RTL
  },
});
