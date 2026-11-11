import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

const STEPS = [
  { n: '1', text: 'Pick a fake network' },
  { n: '2', text: 'Send a test request' },
  { n: '3', text: 'See if it passes or fails' },
];

export default function StepGuide() {
  return (
    <View style={styles.wrap}>
      {STEPS.map((step, index) => (
        <View key={step.n} style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{step.n}</Text>
          </View>
          <Text style={styles.text}>{step.text}</Text>
          {index < STEPS.length - 1 ? <Text style={styles.arrow}>→</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: colors.accentBlue },
  text: { fontSize: 13, color: colors.text, fontWeight: '600' },
  arrow: { fontSize: 13, color: colors.textDim, marginHorizontal: 2 },
});
