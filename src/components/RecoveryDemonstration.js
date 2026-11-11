import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { RefreshCw, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react-native';
import { colors, spacing, typography } from '../constants/theme';
import { useNetworkStore } from '../store/networkStore';

const STEPS = [
  { id: 1, title: 'Start offline', icon: WifiOff },
  { id: 2, title: 'Request fails', icon: XCircle },
  { id: 3, title: 'Switch to normal', icon: Wifi },
  { id: 4, title: 'Retry succeeds', icon: CheckCircle2 },
  { id: 5, title: 'Recovery complete', icon: CheckCircle2 },
];

export default function RecoveryDemonstration() {
  const recoveryStep = useNetworkStore((s) => s.recoveryStep);
  const recoveryRunning = useNetworkStore((s) => s.recoveryRunning);
  const runRecoveryDemo = useNetworkStore((s) => s.runRecoveryDemo);
  const requestState = useNetworkStore((s) => s.requestState);

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Recovery demonstration</Text>
      <View style={styles.card}>
        <Text style={styles.desc}>
          Watch offline failure, connectivity recovery, and a successful retry — fully simulated.
        </Text>
        <View style={styles.steps}>
          {STEPS.map((step) => {
            const active = recoveryStep >= step.id;
            const current = recoveryStep === step.id && recoveryRunning;
            const Icon = step.icon;
            return (
              <Animated.View
                key={step.id}
                layout={Layout.springify()}
                entering={FadeIn}
                style={[styles.step, active && styles.stepActive, current && styles.stepCurrent]}
              >
                <Icon
                  size={14}
                  color={active ? colors.success : colors.textDim}
                />
                <Text style={[styles.stepText, active && styles.stepTextActive]}>{step.title}</Text>
              </Animated.View>
            );
          })}
        </View>
        {recoveryStep >= 4 && requestState === 'success' && (
          <Text style={styles.successNote}>Recovered — request completed on retry.</Text>
        )}
        <Pressable
          disabled={recoveryRunning}
          onPress={runRecoveryDemo}
          style={({ pressed }) => [pressed && !recoveryRunning && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={['#2563EB', colors.accent]}
            style={[styles.btn, recoveryRunning && styles.btnDisabled]}
          >
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.btnText}>
              {recoveryRunning ? 'Running demo…' : 'Run recovery demo'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  sectionTitle: { ...typography.label },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  desc: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  steps: { gap: spacing.sm },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stepActive: { borderColor: colors.success + '55' },
  stepCurrent: { borderColor: colors.accent },
  stepText: { fontSize: 13, color: colors.textDim, fontWeight: '600' },
  stepTextActive: { color: colors.text },
  successNote: { fontSize: 12, color: colors.success, fontWeight: '700' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontWeight: '700' },
});
