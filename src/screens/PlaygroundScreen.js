import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Send, GitCompare } from 'lucide-react-native';
import { colors, spacing } from '../constants/theme';
import { SAMPLE_ENDPOINTS } from '../constants/networkProfiles';
import { useNetworkStore } from '../store/networkStore';
import RequestInspector from '../components/RequestInspector';
import NetworkGuardTimeline from '../components/NetworkGuardTimeline';
import ComparisonTable from '../components/ComparisonTable';

export default function PlaygroundScreen() {
  const selectedEndpointId = useNetworkStore((s) => s.selectedEndpointId);
  const setSelectedEndpoint = useNetworkStore((s) => s.setSelectedEndpoint);
  const sendTestRequest = useNetworkStore((s) => s.sendTestRequest);
  const runComparison = useNetworkStore((s) => s.runComparison);
  const isRequestInFlight = useNetworkStore((s) => s.isRequestInFlight);
  const lastResult = useNetworkStore((s) => s.lastResult);
  const timeline = useNetworkStore((s) => s.timeline);
  const config = useNetworkStore((s) => s.config);
  const comparisonResults = useNetworkStore((s) => s.comparisonResults);
  const comparisonRunning = useNetworkStore((s) => s.comparisonRunning);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Request playground</Text>
      <Text style={styles.sub}>
        Real HTTP via NetworkGuard.createClient() — profile “{config.profileId}”.
      </Text>

      <Text style={styles.label}>Endpoint</Text>
      <View style={styles.chips}>
        {SAMPLE_ENDPOINTS.map((ep) => (
          <Pressable
            key={ep.id}
            disabled={isRequestInFlight || comparisonRunning}
            onPress={() => setSelectedEndpoint(ep.id)}
            style={[styles.chip, selectedEndpointId === ep.id && styles.chipOn]}
          >
            <Text style={styles.chipText}>{ep.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          disabled={isRequestInFlight || comparisonRunning}
          onPress={sendTestRequest}
          style={[styles.primary, (isRequestInFlight || comparisonRunning) && styles.disabled]}
        >
          {isRequestInFlight ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Send size={16} color="#fff" />
          )}
          <Text style={styles.primaryText}>Send request</Text>
        </Pressable>
        <Pressable
          disabled={isRequestInFlight || comparisonRunning}
          onPress={runComparison}
          style={[styles.secondary, (isRequestInFlight || comparisonRunning) && styles.disabled]}
        >
          <GitCompare size={16} color={colors.accentBlue} />
          <Text style={styles.secondaryText}>Compare profiles</Text>
        </Pressable>
      </View>

      <NetworkGuardTimeline timeline={timeline} />

      <Text style={styles.label}>Inspector</Text>
      <RequestInspector result={lastResult} loading={isRequestInFlight} />

      <Text style={[styles.label, styles.compareLabel]}>Measured comparison</Text>
      <ComparisonTable rows={comparisonResults} running={comparisonRunning} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.sm },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  compareLabel: { marginTop: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  chipOn: { borderColor: colors.accent },
  chipText: { fontSize: 11, fontWeight: '600', color: colors.text },
  actions: { flexDirection: 'row', gap: spacing.sm },
  primary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  secondaryText: { color: colors.accentBlue, fontWeight: '700', fontSize: 13 },
  disabled: { opacity: 0.55 },
});
