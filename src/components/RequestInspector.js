import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { formatDuration, formatBytes } from '../utils/formatters';

export default function RequestInspector({ result, loading }) {
  if (loading) {
    return (
      <View style={styles.box}>
        <Text style={styles.headline}>Sending…</Text>
        <Text style={styles.sub}>Real server call + simulated network delay.</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.box}>
        <Text style={styles.headline}>Waiting for you</Text>
        <Text style={styles.sub}>Tap “Send real request” to see success or failure here.</Text>
      </View>
    );
  }

  if (result.error) {
    const err = result.error;
    return (
      <View style={[styles.box, styles.failBox]}>
        <Text style={[styles.headline, styles.fail]}>Failed</Text>
        <Text style={styles.errMsg}>{err.message || String(err)}</Text>
        {err.simulated ? (
          <Text style={styles.sub}>Simulated failure (e.g. offline / packet loss).</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={[styles.headline, result.ok ? styles.ok : styles.fail]}>
        {result.ok ? 'Success' : `Error ${result.status}`}
      </Text>
      <Text style={styles.sub}>
        Took {formatDuration(result.durationMs)} · Profile {result.profileId}
        {result.responseSize ? ` · ${formatBytes(result.responseSize)}` : ''}
      </Text>
      {result.data != null && (
        <Text style={styles.preview} numberOfLines={6}>
          {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    minHeight: 100,
  },
  failBox: { borderColor: colors.failure + '44' },
  headline: { fontSize: 20, fontWeight: '800', color: colors.text },
  ok: { color: colors.success },
  fail: { color: colors.failure },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 18 },
  errMsg: { fontSize: 14, color: colors.failure, fontWeight: '600', marginTop: 8 },
  preview: {
    marginTop: spacing.sm,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textDim,
    lineHeight: 16,
  },
});
