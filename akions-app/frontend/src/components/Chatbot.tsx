import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:3000/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SESSION_STORAGE_KEY = '@akions_chat_session_id';

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { user, accessToken } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session and load history
  useEffect(() => {
    if (isOpen) {
      initializeSession();
    } else {
      // Clean up polling when chat closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  // Start real-time polling when session is ready
  useEffect(() => {
    if (isOpen && sessionId) {
      // Poll for new messages every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        if (sessionId) {
          loadChatHistory();
        }
      }, 2000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const initializeSession = async () => {
    try {
      // Try to get existing session from storage
      let storedSessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      
      // Create or get session
      const response = await fetch(`${API_BASE}/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: storedSessionId,
          userId: user?.id || null,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newSessionId = data.sessionId;
        setSessionId(newSessionId);
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
        
        // Load chat history with the new session ID
        await loadChatHistoryWithSession(newSessionId);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to create session:', response.status, errorData);
        
        // Try to use stored session ID as fallback
        if (storedSessionId) {
          console.log('Trying to use stored session ID:', storedSessionId);
          setSessionId(storedSessionId);
          await loadChatHistoryWithSession(storedSessionId);
        } else {
          // Show error message to user
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: `Unable to initialize chat (Error: ${response.status}). Please check if the backend server is running and try again.`,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages([errorMessage]);
        }
      }
    } catch (error: any) {
      console.error('Initialize session error:', error);
      
      // Try to use stored session ID as fallback
      try {
        const storedSessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSessionId) {
          console.log('Using stored session ID as fallback:', storedSessionId);
          setSessionId(storedSessionId);
          await loadChatHistoryWithSession(storedSessionId);
        } else {
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: `Unable to connect to chat service. Error: ${error.message || 'Network error'}. Please check if the backend server is running on http://localhost:3000`,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages([errorMessage]);
        }
      } catch (fallbackError) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: 'Unable to connect to chat service. Please check your connection and ensure the backend server is running.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
      }
    }
  };

  const loadChatHistoryWithSession = async (sessionIdToLoad: string) => {
    if (!sessionIdToLoad) return;
    
    try {
      const response = await fetch(`${API_BASE}/chat/history/${sessionIdToLoad}`);
      if (response.ok) {
        const history = await response.json();
        if (history && history.length > 0) {
          setMessages(history.map((msg: any) => ({
            id: msg.id,
            text: msg.text || msg.message,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
          })));
        } else {
          // No history, show welcome message
          const welcomeMessage: Message = {
            id: 'welcome',
            text: 'Hello! I\'m the Akions AI assistant. How can I help you today? You can ask me about our services, products, internships, or anything else!',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
      } else {
        console.error('Failed to load history:', response.status);
      }
    } catch (error) {
      console.error('Load history error:', error);
    }
  };

  const loadChatHistory = async () => {
    if (!sessionId) return;
    await loadChatHistoryWithSession(sessionId);
  };

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) {
      if (!sessionId) {
        // Try to initialize session if not ready
        await initializeSession();
        return;
      }
      return;
    }

    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    const userMessageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          sessionId: sessionId,
          userId: user?.id || null,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Remove temp message and reload history to get both user and bot messages
        setMessages((prev) => prev.filter(m => !m.id.startsWith('temp-')));
        // Reload history after a short delay to ensure backend has saved messages
        setTimeout(() => {
          loadChatHistory();
        }, 800);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter(m => !m.id.startsWith('temp-')));
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m having trouble connecting right now. Please try again in a moment or contact us directly at contact@akions.com',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View
        style={[
          styles.chatContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Chat Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botAvatar}>
                <Text style={styles.botAvatarText}>🤖</Text>
              </View>
              <View>
                <Text style={styles.botName}>Akions AI Assistant</Text>
                <Text style={styles.botStatus}>Online</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && (
              <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <Text style={styles.botMessageText}>
                    Hello! I'm the Akions AI assistant. How can I help you today? You can ask me about our services, products, internships, or anything else!
                  </Text>
                </View>
              </View>
            )}
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, styles.typingDotDelay1]} />
                    <View style={[styles.typingDot, styles.typingDotDelay2]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'web' ? '80%' : '85%',
    maxHeight: Platform.OS === 'web' ? 700 : '85%',
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    backgroundColor: '#0f172a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botAvatarText: {
    fontSize: 20,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  botStatus: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#1f2937',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#d1d5db',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  typingDotDelay1: {
    animationDelay: '0.2s',
  },
  typingDotDelay2: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    backgroundColor: '#0f172a',
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

