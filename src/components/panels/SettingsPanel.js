import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing } from '../../constants/theme';
import { useNetworkStore } from '../../store/networkStore';
import RetryConfiguration from '../RetryConfiguration';

export default function SettingsPanel() {
  const conditionId = useNetworkStore((s) => s.conditionId);
  const unstableFailureProbability = useNetworkStore((s) => s.unstableFailureProbability);
  const setUnstableFailureProbability = useNetworkStore((s) => s.setUnstableFailureProbability);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <RetryConfiguration />
      </View>
      {conditionId === 'unstable' && (
        <View style={styles.card}>
          <Text style={styles.label}>Unstable — failure rate</Text>
          <Text style={styles.value}>{Math.round(unstableFailureProbability * 100)}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={0.9}
            step={0.05}
            value={unstableFailureProbability}
            onValueChange={setUnstableFailureProbability}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.cardBorder}
            thumbTintColor={colors.accent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.md },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 0,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  value: { fontSize: 22, fontWeight: '800', color: colors.accentBlue },
  slider: { width: '100%', height: 32 },
});
