import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { SCENARIOS } from '../constants/networkConditions';
import { colors, spacing, typography } from '../constants/theme';
import { useNetworkStore } from '../store/networkStore';

export default function ScenarioLauncher() {
  const runScenario = useNetworkStore((s) => s.runScenario);
  const scenarioRunning = useNetworkStore((s) => s.scenarioRunning);

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Demo scenarios</Text>
      <View style={styles.list}>
        {SCENARIOS.map((scenario) => (
          <Pressable
            key={scenario.id}
            disabled={scenarioRunning}
            onPress={() => runScenario(scenario.id)}
            style={({ pressed }) => [
              styles.row,
              pressed && !scenarioRunning && styles.pressed,
              scenarioRunning && styles.disabled,
            ]}
          >
            <View style={styles.textCol}>
              <Text style={styles.title}>{scenario.title}</Text>
              <Text style={styles.desc}>{scenario.description}</Text>
            </View>
            <View style={styles.play}>
              <Play size={14} color={colors.accentBlue} fill={colors.accentBlue} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  sectionTitle: { ...typography.label },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: { borderColor: colors.accent },
  disabled: { opacity: 0.55 },
  textCol: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  desc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  play: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
});
