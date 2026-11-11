import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { useNetworkStore } from '../../store/networkStore';
import RequestTimeline from '../RequestTimeline';

const MAX_LOGS = 8;

export default function ActivityPanel() {
  const logs = useNetworkStore((s) => s.logs);
  const timeline = useNetworkStore((s) => s.timeline);
  const clearLogs = useNetworkStore((s) => s.clearLogs);

  const visibleLogs = logs.slice(0, MAX_LOGS);

  return (
    <View style={styles.root}>
      <View style={styles.half}>
        <Text style={styles.heading}>Steps</Text>
        <View style={styles.panel}>
          <RequestTimeline timeline={timeline.slice(-6)} />
        </View>
      </View>
      <View style={styles.half}>
        <View style={styles.logHeader}>
          <Text style={styles.heading}>Events</Text>
          {logs.length > 0 && (
            <Pressable onPress={clearLogs} hitSlop={8}>
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.panel}>
          {visibleLogs.length === 0 ? (
            <Text style={styles.empty}>Send a request on the Play tab.</Text>
          ) : (
            visibleLogs.map((entry) => (
              <View key={entry.id} style={styles.logRow}>
                <Text style={styles.time}>{entry.timestamp}</Text>
                <Text style={styles.msg} numberOfLines={2}>
                  {entry.message}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.md },
  half: { flex: 1, minHeight: 0, gap: spacing.xs },
  heading: { fontSize: 11, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clear: { fontSize: 12, fontWeight: '600', color: colors.accentBlue },
  panel: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    minHeight: 0,
    overflow: 'hidden',
  },
  empty: { fontSize: 13, color: colors.textDim },
  logRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  time: { fontSize: 10, color: colors.textDim, width: 52, fontFamily: 'Menlo' },
  msg: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 16 },
});
