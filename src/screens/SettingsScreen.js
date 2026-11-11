import { View, Text, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useNetworkStore } from '../store/networkStore';
import NetworkConfigForm from '../components/NetworkConfigForm';
import RequestMonitor from '../components/RequestMonitor';

export default function SettingsScreen() {
  const config = useNetworkStore((s) => s.config);
  const enabled = useNetworkStore((s) => s.enabled);
  const baseURL = useNetworkStore((s) => s.baseURL);
  const setEnabled = useNetworkStore((s) => s.setEnabled);
  const setBaseURL = useNetworkStore((s) => s.setBaseURL);
  const applyCustomConfig = useNetworkStore((s) => s.applyCustomConfig);
  const requestHistory = useNetworkStore((s) => s.requestHistory);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.inner}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Advanced</Text>
      <Text style={styles.sub}>
        Fine-tune simulation. Your real network is untouched — only HTTP calls through NetworkGuard are
        affected.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Simulation enabled</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.cardBorder, true: colors.accent + '88' }}
            thumbColor={enabled ? colors.accent : colors.textDim}
          />
        </View>
      </View>

      <Text style={styles.section}>API base URL</Text>
      <TextInput
        style={styles.input}
        value={baseURL}
        onChangeText={setBaseURL}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://api.example.com"
        placeholderTextColor={colors.textDim}
      />

      <Text style={styles.section}>Custom values</Text>
      <View style={styles.card}>
        <NetworkConfigForm config={config} onChange={applyCustomConfig} />
      </View>

      <Text style={styles.section}>Recent requests</Text>
      <View style={styles.card}>
        <RequestMonitor history={requestHistory.slice(0, 8)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  inner: { paddingBottom: spacing.xl, gap: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  section: { fontSize: 12, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.text,
    fontSize: 14,
  },
});
