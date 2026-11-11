import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function NetworkProfileCard({ profile, selected, disabled, onPress }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, selected && styles.selected, disabled && styles.disabled]}
    >
      <Text style={[styles.title, selected && styles.titleSelected]}>{profile.label}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {profile.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    flexGrow: 1,
    minWidth: 140,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  selected: { borderColor: colors.accent, backgroundColor: '#1C2233' },
  disabled: { opacity: 0.5 },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  titleSelected: { color: colors.accentBlue },
  desc: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 15 },
});
