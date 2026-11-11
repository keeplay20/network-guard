import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Send, GitCompare } from 'lucide-react-native';
import { colors, spacing } from '../constants/theme';
import { NETWORK_PROFILES, SAMPLE_ENDPOINTS } from '../constants/networkProfiles';
import { useNetworkStore } from '../store/networkStore';
import AppHeader from '../components/AppHeader';
import ProfileChips from '../components/ProfileChips';
import RequestInspector from '../components/RequestInspector';
import ComparisonTable from '../components/ComparisonTable';
import { formatKbps } from '../utils/bandwidth';

export default function TestScreen() {
  const config = useNetworkStore((s) => s.config);
  const enabled = useNetworkStore((s) => s.enabled);
  const setProfile = useNetworkStore((s) => s.setProfile);
  const resetGuard = useNetworkStore((s) => s.resetGuard);
  const selectedEndpointId = useNetworkStore((s) => s.selectedEndpointId);
  const setSelectedEndpoint = useNetworkStore((s) => s.setSelectedEndpoint);
  const sendTestRequest = useNetworkStore((s) => s.sendTestRequest);
  const runComparison = useNetworkStore((s) => s.runComparison);
  const isRequestInFlight = useNetworkStore((s) => s.isRequestInFlight);
  const lastResult = useNetworkStore((s) => s.lastResult);
  const comparisonResults = useNetworkStore((s) => s.comparisonResults);
  const comparisonRunning = useNetworkStore((s) => s.comparisonRunning);

  const profile = NETWORK_PROFILES[config.profileId];
  const busy = isRequestInFlight || comparisonRunning;

  return (
    <View style={styles.root}>
      <AppHeader
        profileLabel={profile?.label || config.profileId}
        enabled={enabled}
        onReset={resetGuard}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.step}>
          <Text style={styles.stepNum}>1</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Pick a fake network</Text>
            <ProfileChips
              selectedId={config.profileId}
              disabled={busy}
              onSelect={setProfile}
            />
            <Text style={styles.stepHint} numberOfLines={2}>
              {profile?.description}
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNum}>2</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Choose API & send</Text>
            <View style={styles.endpointRow}>
              {SAMPLE_ENDPOINTS.map((ep) => (
                <Pressable
                  key={ep.id}
                  disabled={busy}
                  onPress={() => setSelectedEndpoint(ep.id)}
                  style={[styles.endpoint, selectedEndpointId === ep.id && styles.endpointOn]}
                >
                  <Text style={styles.endpointText}>{ep.path}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.btnRow}>
              <Pressable disabled={busy} onPress={sendTestRequest} style={[styles.send, busy && styles.btnOff]}>
                {isRequestInFlight ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Send size={18} color="#fff" />
                )}
                <Text style={styles.sendText}>Send real request</Text>
              </Pressable>
            </View>
            <Pressable disabled={busy} onPress={runComparison} style={[styles.compare, busy && styles.btnOff]}>
              <GitCompare size={16} color={colors.accentBlue} />
              <Text style={styles.compareText}>Compare 4G vs slow vs offline</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNum}>3</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Result</Text>
            <RequestInspector result={lastResult} loading={isRequestInFlight} />
          </View>
        </View>

        {comparisonResults.length > 0 || comparisonRunning ? (
          <View style={styles.compareBlock}>
            <Text style={styles.stepTitle}>Comparison (measured)</Text>
            <ComparisonTable rows={comparisonResults} running={comparisonRunning} />
          </View>
        ) : null}

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Active simulation</Text>
          <Text style={styles.statsLine}>
            {config.latencyMs}ms latency · {formatKbps(config.downloadKbps)} down ·{' '}
            {config.packetLossPercent}% loss
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: spacing.lg, gap: spacing.md },
  step: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent + '35',
    color: colors.accentBlue,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    overflow: 'hidden',
  },
  stepBody: { flex: 1, gap: spacing.sm },
  stepTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  stepHint: { fontSize: 12, color: colors.textDim, lineHeight: 16 },
  endpointRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  endpoint: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  endpointOn: { borderColor: colors.accent },
  endpointText: { fontSize: 13, fontWeight: '600', color: colors.text },
  btnRow: { marginTop: spacing.xs },
  send: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
  },
  sendText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  compare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  compareText: { color: colors.accentBlue, fontWeight: '600', fontSize: 13 },
  btnOff: { opacity: 0.55 },
  compareBlock: { gap: spacing.sm },
  stats: {
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statsTitle: { fontSize: 11, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  statsLine: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
});
