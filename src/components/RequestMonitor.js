import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { formatDuration, formatBytes } from '../utils/formatters';

export default function RequestMonitor({ history }) {
  return (
    <View style={styles.wrap}>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {history.length === 0 ? (
          <Text style={styles.empty}>No requests yet. Use the Playground tab.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.top}>
                <Text style={styles.method}>{item.method}</Text>
                <Text style={styles.path} numberOfLines={1}>
                  {item.path}
                </Text>
                <Text style={[styles.badge, item.ok ? styles.ok : styles.fail]}>
                  {item.ok ? 'OK' : 'FAIL'}
                </Text>
              </View>
              <Text style={styles.meta}>
                {item.profileId} · {item.status != null ? `HTTP ${item.status}` : item.error || '—'} ·{' '}
                {formatDuration(item.durationMs)} · {formatBytes(item.responseSize)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 120 },
  scroll: { flexGrow: 0 },
  empty: { fontSize: 13, color: colors.textDim },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  method: { fontSize: 11, fontWeight: '800', color: colors.accentBlue },
  path: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.text },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ok: { backgroundColor: colors.success + '33', color: colors.success },
  fail: { backgroundColor: colors.failure + '33', color: colors.failure },
  meta: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});
