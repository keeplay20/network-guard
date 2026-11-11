import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { colors, spacing } from '../constants/theme';

const COLORS = {
  blue: colors.timelineBlue,
  purple: colors.timelinePurple,
  green: colors.timelineGreen,
  red: colors.timelineRed,
};

export default function NetworkGuardTimeline({ timeline }) {
  if (!timeline?.length) return null;
  return (
    <View style={styles.wrap}>
      {timeline.map((entry) => (
        <Animated.View key={entry.id} entering={FadeInRight} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: COLORS[entry.color] || colors.accent }]} />
          <Text style={styles.label}>{entry.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
});
