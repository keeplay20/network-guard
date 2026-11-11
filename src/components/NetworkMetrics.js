import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { formatKbps } from '../utils/bandwidth';

export default function NetworkMetrics({ config, enabled }) {
  return (
    <View style={styles.wrap}>
      <Row label="Simulated latency" value={`${config.latencyMs}ms ± ${config.jitterMs}ms jitter`} />
      <Row label="Download" value={config.offline ? '—' : formatKbps(config.downloadKbps)} />
      <Row label="Upload" value={config.offline ? '—' : formatKbps(config.uploadKbps)} />
      <Row label="Packet loss" value={`${config.packetLossPercent}%`} />
      <Row label="Failure chance" value={`${Math.round((config.failureProbability || 0) * 100)}%`} />
      <Row label="Timeout" value={`${config.connectionTimeoutMs}ms`} />
      <Row
        label="Device network"
        value="Unchanged — simulation is HTTP-layer only"
        muted
      />
      <Row label="Guard" value={enabled ? 'Active' : 'Bypassed (direct fetch speed)'} highlight={enabled} />
    </View>
  );
}

function Row({ label, value, muted, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          muted && styles.muted,
          highlight === true && styles.active,
          highlight === false && styles.inactive,
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  label: { fontSize: 12, color: colors.textMuted, flex: 1 },
  value: { fontSize: 12, fontWeight: '600', color: colors.text, flex: 1.2, textAlign: 'right' },
  muted: { color: colors.textDim, fontWeight: '500', fontSize: 11 },
  active: { color: colors.success },
  inactive: { color: colors.warning },
});
