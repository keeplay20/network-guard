import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SCENARIOS } from '../constants/networkConditions';
import { colors, spacing } from '../constants/theme';
import { useNetworkStore } from '../store/networkStore';

const SHORT = {
  happy_path: 'Works',
  slow_connection: 'Slow',
  offline_failure: 'Offline',
  auto_recovery: 'Recover',
  retry_storm: 'Retries',
};

export default function QuickDemos() {
  const runScenario = useNetworkStore((s) => s.runScenario);
  const runRecoveryDemo = useNetworkStore((s) => s.runRecoveryDemo);
  const scenarioRunning = useNetworkStore((s) => s.scenarioRunning);
  const recoveryRunning = useNetworkStore((s) => s.recoveryRunning);
  const busy = scenarioRunning || recoveryRunning;

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {SCENARIOS.map((scenario) => (
          <Pressable
            key={scenario.id}
            disabled={busy}
            onPress={() => runScenario(scenario.id)}
            style={[styles.pill, busy && styles.pillDisabled]}
          >
            <Text style={styles.pillText}>{SHORT[scenario.id] || scenario.title}</Text>
          </Pressable>
        ))}
        <Pressable
          disabled={busy}
          onPress={runRecoveryDemo}
          style={[styles.pill, styles.pillAccent, busy && styles.pillDisabled]}
        >
          {recoveryRunning ? (
            <ActivityIndicator size="small" color={colors.accentBlue} />
          ) : (
            <Text style={[styles.pillText, styles.pillTextAccent]}>Offline→OK</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 0 },
  row: { gap: 6 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillAccent: { borderColor: colors.accent + '66' },
  pillDisabled: { opacity: 0.5 },
  pillText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  pillTextAccent: { color: colors.accentBlue },
});
