import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { PROFILE_LIST } from '../constants/networkProfiles';
import { colors, spacing } from '../constants/theme';

const SHORT = {
  offline: 'Offline',
  'slow-2g': '2G',
  'slow-3g': '3G slow',
  'fast-3g': '3G fast',
  '4g': '4G',
  'high-latency': 'Lag',
  unstable: 'Flaky',
};

export default function ProfileChips({ selectedId, disabled, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {PROFILE_LIST.map((p) => {
        const on = selectedId === p.id;
        return (
          <Pressable
            key={p.id}
            disabled={disabled}
            onPress={() => onSelect(p.id)}
            style={[styles.chip, on && styles.chipOn, disabled && styles.disabled]}
          >
            <Text style={[styles.text, on && styles.textOn]}>{SHORT[p.id] || p.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipOn: { borderColor: colors.accent, backgroundColor: '#1A2030' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  textOn: { color: colors.accentBlue },
});
