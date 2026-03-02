import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal,
} from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  internshipId?: { title?: string };
  coverLetter?: string;
  skills?: string[];
  experience?: string;
  status?: string;
  createdAt: string;
}

export const AdminApplicationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') { navigation.navigate('Home'); return; }
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/internships/applications`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) { const data = await res.json(); setApplications(data); }
    } catch (e) { console.error('Load apps error:', e); }
    finally { setLoading(false); }
  };

  if (user?.role !== 'admin') return null;

  const statusColor = (s?: string) => {
    if (s === 'accepted') return '#10b981';
    if (s === 'rejected') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="applications" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Internship Applications</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{applications.length} total</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color="#3b82f6" style={{ marginTop: 40 }} />
          ) : applications.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No applications yet</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {applications.map((app) => (
                <TouchableOpacity
                  key={app._id}
                  style={styles.card}
                  onPress={() => setSelected(app)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.applicantName}>{app.fullName}</Text>
                      <Text style={styles.applicantEmail}>{app.email}</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: statusColor(app.status) + '22', borderColor: statusColor(app.status) }]}>
                      <Text style={[styles.statusText, { color: statusColor(app.status) }]}>
                        {app.status || 'Pending'}
                      </Text>
                    </View>
                  </View>

                  {app.internshipId?.title && (
                    <Text style={styles.internshipTitle}>
                      Applying for: <Text style={styles.internshipTitleBold}>{app.internshipId.title}</Text>
                    </Text>
                  )}

                  {app.skills && app.skills.length > 0 && (
                    <View style={styles.skillsRow}>
                      {app.skills.slice(0, 4).map((sk) => (
                        <View key={sk} style={styles.skillChip}>
                          <Text style={styles.skillText}>{sk}</Text>
                        </View>
                      ))}
                      {app.skills.length > 4 && (
                        <Text style={styles.moreSkills}>+{app.skills.length - 4}</Text>
                      )}
                    </View>
                  )}

                  <Text style={styles.date}>
                    Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selected?.fullName}</Text>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalEmail}>{selected?.email}</Text>
              {selected?.phone && <Text style={styles.modalField}>📞 {selected.phone}</Text>}
              {selected?.internshipId?.title && (
                <Text style={styles.modalField}>💼 {selected.internshipId.title}</Text>
              )}
              {selected?.experience && (
                <>
                  <Text style={styles.modalSectionLabel}>Experience</Text>
                  <Text style={styles.modalBody}>{selected.experience}</Text>
                </>
              )}
              {selected?.coverLetter && (
                <>
                  <Text style={styles.modalSectionLabel}>Cover Letter</Text>
                  <Text style={styles.modalBody}>{selected.coverLetter}</Text>
                </>
              )}
              {selected?.skills && (
                <>
                  <Text style={styles.modalSectionLabel}>Skills</Text>
                  <View style={styles.skillsRow}>
                    {selected.skills.map((sk) => (
                      <View key={sk} style={styles.skillChip}>
                        <Text style={styles.skillText}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1a' },
  scroll: { paddingBottom: 40 },
  inner: { padding: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#f1f5f9', letterSpacing: -0.5 },
  countBadge: { backgroundColor: '#1e3a8a', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  countText: { color: '#93c5fd', fontSize: 13, fontWeight: '700' },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#475569', fontSize: 16 },
  list: { gap: 14 },
  card: { backgroundColor: '#0f172a', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1e293b', gap: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  applicantName: { color: '#f1f5f9', fontSize: 17, fontWeight: '700' },
  applicantEmail: { color: '#64748b', fontSize: 13, marginTop: 2 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: '700' },
  internshipTitle: { color: '#64748b', fontSize: 13 },
  internshipTitleBold: { color: '#93c5fd', fontWeight: '700' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  skillText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  moreSkills: { color: '#475569', fontSize: 12, alignSelf: 'center' },
  date: { color: '#334155', fontSize: 12, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#0f172a', borderRadius: 16, padding: 24, width: '100%', maxWidth: 580, maxHeight: '85%', borderWidth: 1, borderColor: '#1e293b' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#f1f5f9', flex: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#94a3b8', fontSize: 16, fontWeight: '700' },
  modalEmail: { color: '#64748b', fontSize: 14, marginBottom: 16 },
  modalField: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  modalSectionLabel: { color: '#475569', fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 16, marginBottom: 6 },
  modalBody: { color: '#cbd5e1', fontSize: 14, lineHeight: 22 },
});
