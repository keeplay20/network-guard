import { View, Text, Pressable, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, RotateCcw } from 'lucide-react-native';
import { colors, spacing } from '../constants/theme';
import { PROFILE_LIST } from '../constants/networkProfiles';
import { useNetworkStore } from '../store/networkStore';
import NetworkProfileCard from '../components/NetworkProfileCard';
import NetworkMetrics from '../components/NetworkMetrics';
import NetworkConfigForm from '../components/NetworkConfigForm';
import RequestMonitor from '../components/RequestMonitor';

export default function DashboardScreen() {
  const config = useNetworkStore((s) => s.config);
  const enabled = useNetworkStore((s) => s.enabled);
  const baseURL = useNetworkStore((s) => s.baseURL);
  const setProfile = useNetworkStore((s) => s.setProfile);
  const applyCustomConfig = useNetworkStore((s) => s.applyCustomConfig);
  const setEnabled = useNetworkStore((s) => s.setEnabled);
  const setBaseURL = useNetworkStore((s) => s.setBaseURL);
  const resetGuard = useNetworkStore((s) => s.resetGuard);
  const isRequestInFlight = useNetworkStore((s) => s.isRequestInFlight);
  const requestHistory = useNetworkStore((s) => s.requestHistory);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <LinearGradient colors={['#6366F1', '#2563EB']} style={styles.logo}>
          <Shield size={22} color="#fff" />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>NetworkGuard</Text>
          <Text style={styles.sub}>Simulated profile: {config.profileId}</Text>
        </View>
        <View style={[styles.pill, enabled ? styles.pillOn : styles.pillOff]}>
          <Text style={styles.pillText}>{enabled ? 'Active' : 'Off'}</Text>
        </View>
        <Pressable onPress={resetGuard} style={styles.iconBtn}>
          <RotateCcw size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>
        Simulates HTTP behavior only. Your device Wi‑Fi/cellular is not modified.
      </Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.rowSwitch}>
          <Text style={styles.sectionTitle}>Enable simulation</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.cardBorder, true: colors.accent + '88' }}
            thumbColor={enabled ? colors.accent : colors.textDim}
          />
        </View>

        <Text style={styles.sectionTitle}>Profiles (approximate)</Text>
        <View style={styles.profileGrid}>
          {PROFILE_LIST.map((p) => (
            <NetworkProfileCard
              key={p.id}
              profile={p}
              selected={config.profileId === p.id}
              disabled={isRequestInFlight}
              onPress={() => setProfile(p.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>API base URL</Text>
        <TextInput
          style={styles.input}
          value={baseURL}
          onChangeText={setBaseURL}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="https://api.example.com"
          placeholderTextColor={colors.textDim}
        />

        <Text style={styles.sectionTitle}>Current summary</Text>
        <View style={styles.card}>
          <NetworkMetrics config={config} enabled={enabled} />
        </View>

        <Text style={styles.sectionTitle}>Custom tuning</Text>
        <View style={styles.card}>
          <NetworkConfigForm config={config} onChange={applyCustomConfig} />
        </View>

        <Text style={styles.sectionTitle}>Request monitor</Text>
        <View style={styles.card}>
          <RequestMonitor history={requestHistory} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  pillOn: { backgroundColor: colors.success + '33' },
  pillOff: { backgroundColor: colors.warning + '33' },
  pillText: { fontSize: 11, fontWeight: '800', color: colors.text },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  disclaimer: { fontSize: 11, color: colors.textDim, marginTop: spacing.sm, lineHeight: 16 },
  scroll: { flex: 1, marginTop: spacing.md },
  scrollContent: { paddingBottom: spacing.xl, gap: spacing.md },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  rowSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.text,
    fontSize: 14,
  },
});
