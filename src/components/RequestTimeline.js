import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing } from '../constants/theme';
import { formatDuration } from '../utils/formatTime';

const COLOR_MAP = {
  blue: colors.timelineBlue,
  purple: colors.timelinePurple,
  amber: colors.timelineAmber,
  green: colors.timelineGreen,
  red: colors.timelineRed,
};

const PLAIN_LABELS = {
  request_started: 'Started',
  network_check: 'Checked network',
  request_sent: 'Sent to server',
  server_response: 'Got a response',
  outcome: 'Finished',
  retry_wait: 'Waiting to retry',
  recovered: 'Worked after retry',
  final_failure: 'Gave up',
};

function TimelineNode({ entry, isLast, startTime }) {
  const dotScale = useSharedValue(0.6);

  useEffect(() => {
    dotScale.value = withTiming(1, { duration: 350 });
  }, [entry.id, dotScale]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const accent = COLOR_MAP[entry.color] || colors.accentBlue;
  const elapsed = entry.timestamp - startTime;
  const label = PLAIN_LABELS[entry.step] || entry.label;

  return (
    <Animated.View entering={FadeInDown.duration(280)} style={styles.node}>
      <View style={styles.rail}>
        <Animated.View style={[styles.dot, { backgroundColor: accent }, dotStyle]} />
        {!isLast && <View style={[styles.line, { backgroundColor: accent + '44' }]} />}
      </View>
      <View style={styles.nodeContent}>
        <Text style={styles.nodeLabel}>{label}</Text>
        {elapsed >= 0 ? (
          <Text style={styles.nodeMeta}>+{formatDuration(elapsed)}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

export default function RequestTimeline({ timeline }) {
  const startTime = timeline[0]?.timestamp ?? Date.now();

  return (
    <View style={styles.wrap}>
      {timeline.length === 0 ? (
        <Text style={styles.empty}>Step-by-step view appears after you send a request.</Text>
      ) : (
        timeline.map((entry, index) => (
          <TimelineNode
            key={entry.id}
            entry={entry}
            isLast={index === timeline.length - 1}
            startTime={startTime}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  empty: { fontSize: 13, color: colors.textDim, lineHeight: 18 },
  node: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xs },
  rail: { width: 16, alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginTop: 2,
  },
  nodeContent: { flex: 1, paddingBottom: spacing.xs },
  nodeLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  nodeMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
