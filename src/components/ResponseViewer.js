import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import { formatDuration } from '../utils/formatTime';

const STATE_COLORS = {
  idle: colors.textDim,
  loading: colors.warning,
  success: colors.success,
  error: colors.failure,
  cancelled: colors.textMuted,
};

export default function ResponseViewer({ requestState, response, isRequestInFlight }) {
  const statusColor = STATE_COLORS[requestState] || colors.textMuted;

  let bodyText = 'Send a request to inspect the simulated response.';
  if (response?.body) {
    bodyText = JSON.stringify(response.body, null, 2);
  } else if (response?.errorMessage) {
    bodyText = response.errorMessage;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Response</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Metric label="Status" value={requestState.toUpperCase()} color={statusColor} />
          <Metric
            label="HTTP"
            value={response?.statusCode != null ? String(response.statusCode) : '—'}
          />
          <Metric
            label="Time"
            value={response?.durationMs != null ? formatDuration(response.durationMs) : '—'}
          />
          <Metric label="Attempt" value={response?.attempt != null ? String(response.attempt) : '—'} />
        </View>
        {isRequestInFlight && (
          <Text style={styles.loading}>Awaiting simulated network response…</Text>
        )}
        <View style={styles.bodyBox}>
          <Text style={styles.mono}>{bodyText}</Text>
        </View>
      </View>
    </View>
  );
}

function Metric({ label, value, color }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color && { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  sectionTitle: { ...typography.label },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metric: { minWidth: '22%', flexGrow: 1 },
  metricLabel: { fontSize: 10, color: colors.textDim, textTransform: 'uppercase', fontWeight: '600' },
  metricValue: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  loading: { fontSize: 12, color: colors.warning, fontWeight: '600' },
  bodyBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    maxHeight: 160,
  },
  mono: { ...typography.mono, lineHeight: 18 },
});
