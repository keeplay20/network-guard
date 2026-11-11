import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Shield, RotateCcw } from 'lucide-react-native';
import { colors, spacing } from '../constants/theme';

export default function AppHeader({ profileLabel, enabled, onReset }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Shield size={20} color="#fff" />
        </View>
        <Text style={styles.title}>NetworkGuard</Text>
        <View style={[styles.badge, enabled ? styles.badgeOn : styles.badgeOff]}>
          <Text style={styles.badgeText}>{enabled ? 'On' : 'Off'}</Text>
        </View>
        <Pressable onPress={onReset} style={styles.reset} hitSlop={8}>
          <RotateCcw size={15} color={colors.textMuted} />
        </Pressable>
      </View>
      <Text style={styles.hint}>
        Testing: <Text style={styles.hintBold}>{profileLabel}</Text> · Does not change your phone’s
        Wi‑Fi
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing.sm, gap: 4 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: colors.text },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeOn: { backgroundColor: colors.success + '40' },
  badgeOff: { backgroundColor: colors.warning + '40' },
  badgeText: { fontSize: 11, fontWeight: '800', color: colors.text },
  reset: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  hint: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  hintBold: { color: colors.accentBlue, fontWeight: '700' },
});
