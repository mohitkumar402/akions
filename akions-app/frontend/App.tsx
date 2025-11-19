import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Chatbot } from './src/components/Chatbot';
import { ChatbotButton } from './src/components/ChatbotButton';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <AuthProvider>
      <AppNavigator />
      <ChatbotButton onPress={() => setIsChatOpen(true)} />
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
