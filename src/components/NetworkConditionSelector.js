import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { CONDITION_LIST } from '../constants/networkConditions';
import { colors, spacing } from '../constants/theme';
import { useNetworkStore } from '../store/networkStore';
import { getConditionOneLiner } from '../utils/requestStatusText';

export default function NetworkConditionSelector() {
  const conditionId = useNetworkStore((s) => s.conditionId);
  const setCondition = useNetworkStore((s) => s.setCondition);
  const unstableFailureProbability = useNetworkStore((s) => s.unstableFailureProbability);
  const setUnstableFailureProbability = useNetworkStore((s) => s.setUnstableFailureProbability);
  const isRequestInFlight = useNetworkStore((s) => s.isRequestInFlight);

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Step 1 — Fake network</Text>
      <Text style={styles.help}>Not your real Wi‑Fi. Just a setting for this playground.</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CONDITION_LIST.map((item) => {
          const selected = conditionId === item.id;
          return (
            <Pressable
              key={item.id}
              disabled={isRequestInFlight}
              onPress={() => setCondition(item.id)}
              style={[
                styles.chip,
                selected && styles.chipSelected,
                isRequestInFlight && styles.disabled,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text style={styles.current}>{getConditionOneLiner(conditionId)}</Text>
      {conditionId === 'unstable' && (
        <View style={styles.sliderBlock}>
          <Text style={styles.sliderLabel}>
            How often it fails: {Math.round(unstableFailureProbability * 100)}%
          </Text>
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
  wrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heading: { fontSize: 16, fontWeight: '700', color: colors.text },
  help: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: '#1C2233',
  },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  chipTextSelected: { color: colors.accentBlue },
  current: { fontSize: 13, color: colors.text, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  sliderBlock: { marginTop: spacing.sm },
  sliderLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  slider: { width: '100%', height: 32 },
});
