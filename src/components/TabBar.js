import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Zap, Settings2 } from 'lucide-react-native';
import { colors, spacing } from '../constants/theme';

const TABS = [
  { id: 'test', label: 'Test', Icon: Zap },
  { id: 'settings', label: 'Advanced', Icon: Settings2 },
];

export default function TabBar({ active, onChange }) {
  return (
    <View style={styles.wrap}>
      {TABS.map(({ id, label, Icon }) => {
        const selected = active === id;
        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Icon size={20} color={selected ? colors.accentBlue : colors.textDim} />
            <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.card,
    paddingBottom: spacing.xs,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
    minHeight: 52,
  },
  tabSelected: { backgroundColor: colors.background },
  label: { fontSize: 12, fontWeight: '600', color: colors.textDim },
  labelSelected: { color: colors.accentBlue },
});
