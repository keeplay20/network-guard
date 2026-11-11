import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { useNetworkStore } from '../store/networkStore';
import { colors, spacing } from '../constants/theme';

function Stepper({ label, value, onChange, min, max, step }) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - step))}
          style={styles.stepperBtn}
        >
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + step))}
          style={styles.stepperBtn}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RetryConfiguration() {
  const retryConfig = useNetworkStore((s) => s.retryConfig);
  const setRetryConfig = useNetworkStore((s) => s.setRetryConfig);

  return (
    <View style={styles.inner}>
      <Text style={styles.intro}>
        When a request fails, should the app try again? Adjust how many times and how long to wait.
      </Text>
      <Stepper
        label="Times to retry"
        value={retryConfig.maxRetries}
        min={0}
        max={5}
        step={1}
        onChange={(maxRetries) => setRetryConfig({ maxRetries })}
      />
      <Stepper
        label="Wait between tries (ms)"
        value={retryConfig.baseDelayMs}
        min={500}
        max={5000}
        step={250}
        onChange={(baseDelayMs) => setRetryConfig({ baseDelayMs })}
      />
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Wait longer each time</Text>
        <Switch
          value={retryConfig.exponentialBackoff}
          onValueChange={(exponentialBackoff) => setRetryConfig({ exponentialBackoff })}
          trackColor={{ false: colors.cardBorder, true: colors.accent + '88' }}
          thumbColor={retryConfig.exponentialBackoff ? colors.accent : colors.textDim}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Retry if it times out</Text>
        <Switch
          value={retryConfig.retryOnTimeout}
          onValueChange={(retryOnTimeout) => setRetryConfig({ retryOnTimeout })}
          trackColor={{ false: colors.cardBorder, true: colors.accent + '88' }}
          thumbColor={retryConfig.retryOnTimeout ? colors.accent : colors.textDim}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Retry if server errors</Text>
        <Switch
          value={retryConfig.retryOnServerError}
          onValueChange={(retryOnServerError) => setRetryConfig({ retryOnServerError })}
          trackColor={{ false: colors.cardBorder, true: colors.accent + '88' }}
          thumbColor={retryConfig.retryOnServerError ? colors.accent : colors.textDim}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: { gap: spacing.sm, flex: 1, justifyContent: 'space-evenly' },
  intro: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: { fontSize: 14, color: colors.text, flex: 1 },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  stepperValue: {
    minWidth: 52,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.accentBlue,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { fontSize: 14, color: colors.text },
});
