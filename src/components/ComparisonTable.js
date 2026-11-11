import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { formatDuration } from '../utils/formatters';

export default function ComparisonTable({ rows, running }) {
  if (running) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>Testing each profile against the same endpoint…</Text>
      </View>
    );
  }

  if (!rows?.length) return null;

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.head]}>Profile</Text>
        <Text style={[styles.cell, styles.head, styles.right]}>Time</Text>
        <Text style={[styles.cell, styles.head, styles.rightFlex]}>Result</Text>
      </View>
      {rows.map((row) => (
        <View key={row.profileId} style={styles.dataRow}>
          <Text style={styles.cell}>{row.label}</Text>
          <Text style={[styles.cell, styles.right]}>
            {row.durationMs != null ? formatDuration(row.durationMs) : '—'}
          </Text>
          <Text style={[styles.cell, styles.rightFlex]} numberOfLines={2}>
            {row.result}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
  },
  cell: { flex: 1, fontSize: 12, color: colors.text, fontWeight: '600' },
  head: { color: colors.textDim, fontSize: 11, textTransform: 'uppercase' },
  right: { textAlign: 'right', flex: 0.7 },
  rightFlex: { flex: 1.2, textAlign: 'right' },
  loading: { alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  loadingText: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
