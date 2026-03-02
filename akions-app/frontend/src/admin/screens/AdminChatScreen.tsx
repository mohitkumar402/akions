import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

interface ChatSession {
  sessionId: string;
  userEmail?: string;
  status: 'active' | 'resolved' | 'pending';
  lastMessage?: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  timestamp: string;
}

export const AdminChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') { navigation.navigate('Home'); return; }
    loadSessions();
    loadStats();
  }, [user]);

  const loadSessions = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/chats/sessions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { const data = await res.json(); setSessions(data); }
    } catch (e) { console.error('Load sessions error:', e); }
    finally { setLoading(false); }
  };

  const loadStats = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/admin/chats/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { const data = await res.json(); setStats(data); }
    } catch (e) {}
  };

  const openSession = async (session: ChatSession) => {
    setSelectedSession(session);
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/admin/chats/sessions/${session.sessionId}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { const data = await res.json(); setMessages(data); }
    } catch (e) {}
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedSession || !accessToken) return;
    setSendingReply(true);
    try {
      const res = await fetch(`${API_BASE}/admin/chats/sessions/${selectedSession.sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ message: reply }),
      });
      if (res.ok) {
        setReply('');
        openSession(selectedSession);
      }
    } catch (e) {}
    finally { setSendingReply(false); }
  };

  const updateStatus = async (sessionId: string, status: string) => {
    if (!accessToken) return;
    try {
      await fetch(`${API_BASE}/admin/chats/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status }),
      });
      loadSessions();
    } catch (e) {}
  };

  const deleteSession = (sessionId: string) => {
    Alert.alert('Delete Session', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          if (!accessToken) return;
          await fetch(`${API_BASE}/admin/chats/sessions/${sessionId}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (selectedSession?.sessionId === sessionId) setSelectedSession(null);
          loadSessions();
        },
      },
    ]);
  };

  if (user?.role !== 'admin') return null;

  const statusColor = (s: string) =>
    s === 'active' ? '#10b981' : s === 'pending' ? '#f59e0b' : '#6b7280';

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="chat" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <Text style={styles.pageTitle}>Chat Management</Text>

          {/* Stats */}
          {stats && (
            <View style={styles.statsRow}>
              {[
                { label: 'Total', value: stats.total ?? 0, color: '#3b82f6' },
                { label: 'Active', value: stats.active ?? 0, color: '#10b981' },
                { label: 'Pending', value: stats.pending ?? 0, color: '#f59e0b' },
                { label: 'Resolved', value: stats.resolved ?? 0, color: '#6b7280' },
              ].map((s) => (
                <View key={s.label} style={[styles.statCard, { borderLeftColor: s.color }]}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.layout}>
            {/* Sessions list */}
            <View style={styles.sessionsList}>
              <Text style={styles.sectionTitle}>Sessions</Text>
              {loading ? (
                <ActivityIndicator color="#3b82f6" style={{ marginTop: 24 }} />
              ) : sessions.length === 0 ? (
                <Text style={styles.empty}>No chat sessions found</Text>
              ) : (
                sessions.map((s) => (
                  <TouchableOpacity
                    key={s.sessionId}
                    style={[styles.sessionCard, selectedSession?.sessionId === s.sessionId && styles.sessionCardActive]}
                    onPress={() => openSession(s)}
                  >
                    <View style={styles.sessionTop}>
                      <Text style={styles.sessionId} numberOfLines={1}>
                        {s.userEmail || s.sessionId.substring(0, 16) + '…'}
                      </Text>
                      <View style={[styles.statusDot, { backgroundColor: statusColor(s.status) }]} />
                    </View>
                    {s.lastMessage && (
                      <Text style={styles.sessionPreview} numberOfLines={1}>{s.lastMessage}</Text>
                    )}
                    <View style={styles.sessionMeta}>
                      <Text style={styles.sessionMetaText}>{s.messageCount} msgs</Text>
                      <TouchableOpacity onPress={() => updateStatus(s.sessionId, s.status === 'resolved' ? 'active' : 'resolved')}>
                        <Text style={styles.resolveBtn}>{s.status === 'resolved' ? 'Reopen' : 'Resolve'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteSession(s.sessionId)}>
                        <Text style={styles.deleteBtn}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Messages panel */}
            <View style={styles.messagesPanel}>
              {selectedSession ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Conversation – {selectedSession.userEmail || selectedSession.sessionId.substring(0, 20)}
                  </Text>
                  <ScrollView style={styles.messagesScroll}>
                    {messages.map((m) => (
                      <View
                        key={m._id}
                        style={[
                          styles.messageBubble,
                          m.role === 'user' ? styles.bubbleUser : m.role === 'admin' ? styles.bubbleAdmin : styles.bubbleBot,
                        ]}
                      >
                        <Text style={styles.bubbleRole}>{m.role.toUpperCase()}</Text>
                        <Text style={styles.bubbleContent}>{m.content}</Text>
                        <Text style={styles.bubbleTime}>{new Date(m.timestamp).toLocaleTimeString()}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.replyRow}>
                    <TextInput
                      style={styles.replyInput}
                      value={reply}
                      onChangeText={setReply}
                      placeholder="Type a reply…"
                      placeholderTextColor="#475569"
                      multiline
                    />
                    <TouchableOpacity
                      style={[styles.sendBtn, sendingReply && { opacity: 0.6 }]}
                      onPress={sendReply}
                      disabled={sendingReply}
                    >
                      <Text style={styles.sendBtnText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.noSelection}>
                  <Text style={styles.noSelectionIcon}>💬</Text>
                  <Text style={styles.noSelectionText}>Select a session to view messages</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1a' },
  scroll: { paddingBottom: 40 },
  inner: { padding: 24 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#f1f5f9', marginBottom: 20, letterSpacing: -0.5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 100, backgroundColor: '#0f172a', borderRadius: 12, padding: 16, borderLeftWidth: 3, borderWidth: 1, borderColor: '#1e293b' },
  statValue: { fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 4, fontWeight: '600' },
  layout: { flexDirection: 'row', gap: 20, minHeight: 500 },
  sessionsList: { width: 280, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#94a3b8', marginBottom: 12, letterSpacing: 0.3, textTransform: 'uppercase' },
  empty: { color: '#475569', fontSize: 14, textAlign: 'center', marginTop: 24 },
  sessionCard: { backgroundColor: '#0f172a', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#1e293b', gap: 6 },
  sessionCardActive: { borderColor: '#3b82f6', backgroundColor: '#0d1b35' },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionId: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', flex: 1, marginRight: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  sessionPreview: { color: '#475569', fontSize: 12 },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  sessionMetaText: { color: '#334155', fontSize: 11 },
  resolveBtn: { color: '#10b981', fontSize: 11, fontWeight: '700' },
  deleteBtn: { color: '#ef4444', fontSize: 11, fontWeight: '700' },
  messagesPanel: { flex: 1, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', padding: 16, gap: 12 },
  messagesScroll: { flex: 1, maxHeight: 400 },
  messageBubble: { marginBottom: 12, padding: 12, borderRadius: 10, maxWidth: '85%' },
  bubbleUser: { backgroundColor: '#1e3a8a', alignSelf: 'flex-end' },
  bubbleBot: { backgroundColor: '#1e293b', alignSelf: 'flex-start' },
  bubbleAdmin: { backgroundColor: '#14532d', alignSelf: 'flex-end' },
  bubbleRole: { color: '#64748b', fontSize: 10, fontWeight: '800', marginBottom: 4, letterSpacing: 1 },
  bubbleContent: { color: '#e2e8f0', fontSize: 14, lineHeight: 20 },
  bubbleTime: { color: '#475569', fontSize: 10, marginTop: 4, textAlign: 'right' },
  replyRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  replyInput: { flex: 1, backgroundColor: '#1e293b', borderRadius: 10, borderWidth: 1, borderColor: '#334155', padding: 12, color: '#e2e8f0', fontSize: 14, maxHeight: 100 },
  sendBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  noSelection: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  noSelectionIcon: { fontSize: 48 },
  noSelectionText: { color: '#475569', fontSize: 16 },
});
