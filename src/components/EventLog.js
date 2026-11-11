import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function EventLog({ logs, onClear }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.hint}>Plain-English record of what happened.</Text>
        {logs.length > 0 && (
          <Pressable onPress={onClear} hitSlop={8}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {logs.length === 0 ? (
          <Text style={styles.empty}>Events show up here after you send a request.</Text>
        ) : (
          logs.map((entry) => (
            <View key={entry.id} style={styles.row}>
              <Text style={styles.time}>{entry.timestamp}</Text>
              <Text style={styles.message}>{entry.message}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, maxHeight: 200 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hint: { fontSize: 12, color: colors.textDim, flex: 1 },
  clearText: { fontSize: 13, color: colors.accentBlue, fontWeight: '600' },
  scroll: { flexGrow: 0 },
  empty: { fontSize: 13, color: colors.textDim, paddingVertical: spacing.sm },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  time: { fontSize: 11, color: colors.textDim, width: 58, fontFamily: 'Menlo' },
  message: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
});
