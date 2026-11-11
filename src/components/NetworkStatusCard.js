import { View, Text, StyleSheet } from 'react-native';
import { Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react-native';
import { colors, spacing, typography } from '../constants/theme';
import { NETWORK_CONDITIONS } from '../constants/networkConditions';

const STATUS_COLORS = {
  normal: colors.success,
  slow3g: colors.warning,
  offline: colors.failure,
  timeout: colors.failure,
  serverError: colors.failure,
  unstable: colors.warning,
};

export default function NetworkStatusCard({ conditionId }) {
  const condition = NETWORK_CONDITIONS[conditionId];
  const accent = STATUS_COLORS[conditionId] || colors.accent;

  const Icon =
    conditionId === 'offline'
      ? WifiOff
      : conditionId === 'unstable' || conditionId === 'timeout'
        ? AlertTriangle
        : conditionId === 'slow3g'
          ? Activity
          : Wifi;

  return (
    <View style={[styles.card, { borderColor: accent + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '22' }]}>
        <Icon size={18} color={accent} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Simulated status</Text>
        <Text style={styles.value}>{condition.label}</Text>
        <Text style={styles.meta}>
          {condition.mode === 'offline'
            ? 'No connectivity'
            : `Latency ~${condition.latencyMs}ms`}
        </Text>
      </View>
      <View style={[styles.dot, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  label: { ...typography.label, fontSize: 10, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { ...typography.subtitle, marginTop: 2, fontSize: 12 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
