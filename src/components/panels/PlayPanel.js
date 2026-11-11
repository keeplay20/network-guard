import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Send, RotateCcw } from 'lucide-react-native';
import { CONDITION_LIST, MOCK_ENDPOINTS } from '../../constants/networkConditions';
import { colors, spacing } from '../../constants/theme';
import { useNetworkStore, selectEndpoint } from '../../store/networkStore';
import { REQUEST_STATUS, getConditionOneLiner } from '../../utils/requestStatusText';
import { formatDuration } from '../../utils/formatTime';
import QuickDemos from '../QuickDemos';

const TONE_COLORS = {
  muted: colors.textMuted,
  warning: colors.warning,
  success: colors.success,
  error: colors.failure,
};

export default function PlayPanel() {
  const conditionId = useNetworkStore((s) => s.conditionId);
  const setCondition = useNetworkStore((s) => s.setCondition);
  const selectedEndpointId = useNetworkStore((s) => s.selectedEndpointId);
  const setSelectedEndpoint = useNetworkStore((s) => s.setSelectedEndpoint);
  const sendRequest = useNetworkStore((s) => s.sendRequest);
  const retryLastRequest = useNetworkStore((s) => s.retryLastRequest);
  const cancelRequest = useNetworkStore((s) => s.cancelRequest);
  const isRequestInFlight = useNetworkStore((s) => s.isRequestInFlight);
  const requestState = useNetworkStore((s) => s.requestState);
  const response = useNetworkStore((s) => s.response);
  const endpoint = useNetworkStore(selectEndpoint);

  const status = REQUEST_STATUS[requestState] || REQUEST_STATUS.idle;
  const toneColor = TONE_COLORS[status.tone];

  return (
    <View style={styles.root}>
      <Text style={styles.sectionLabel}>Network</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {CONDITION_LIST.map((item) => {
          const selected = conditionId === item.id;
          return (
            <Pressable
              key={item.id}
              disabled={isRequestInFlight}
              onPress={() => setCondition(item.id)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text style={styles.hint} numberOfLines={1}>
        {getConditionOneLiner(conditionId)}
      </Text>

      <QuickDemos />

      <Text style={[styles.sectionLabel, styles.sectionGap]}>API</Text>
      <View style={styles.endpoints}>
        {MOCK_ENDPOINTS.map((item) => {
          const active = selectedEndpointId === item.id;
          return (
            <Pressable
              key={item.id}
              disabled={isRequestInFlight}
              onPress={() => setSelectedEndpoint(item.id)}
              style={[styles.endpoint, active && styles.endpointActive]}
            >
              <Text style={styles.endpointText} numberOfLines={1}>
                {item.path}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          disabled={isRequestInFlight}
          onPress={sendRequest}
          style={[styles.sendBtn, isRequestInFlight && styles.sendBtnBusy]}
        >
          {isRequestInFlight ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Send size={17} color="#fff" />
          )}
          <Text style={styles.sendText}>{isRequestInFlight ? 'Sending…' : 'Send'}</Text>
        </Pressable>
        {isRequestInFlight ? (
          <Pressable onPress={cancelRequest} style={styles.sideBtn}>
            <Text style={styles.cancelText}>Stop</Text>
          </Pressable>
        ) : requestState === 'error' ? (
          <Pressable onPress={retryLastRequest} style={styles.sideBtn}>
            <RotateCcw size={16} color={colors.text} />
            <Text style={styles.sideBtnText}>Retry</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.result, { borderColor: toneColor + '66' }, styles.resultFlex]}>
        <Text style={[styles.resultTitle, { color: toneColor }]} numberOfLines={1}>
          {status.headline}
        </Text>
        <Text style={styles.resultSub} numberOfLines={2}>
          {response?.errorMessage || status.sub}
        </Text>
        {(response?.statusCode > 0 || response?.durationMs != null) && (
          <Text style={styles.meta}>
            {response?.statusCode > 0 ? `HTTP ${response.statusCode}` : ''}
            {response?.durationMs != null ? ` · ${formatDuration(response.durationMs)}` : ''}
          </Text>
        )}
        <Text style={styles.endpointMeta} numberOfLines={1}>
          {endpoint.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.sm },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  sectionGap: { marginTop: spacing.xs },
  chipsScroll: { flexGrow: 0, maxHeight: 40 },
  chips: { gap: spacing.sm, alignItems: 'center' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipSelected: { borderColor: colors.accent, backgroundColor: '#1C2233' },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextSelected: { color: colors.accentBlue },
  hint: { fontSize: 12, color: colors.textMuted },
  endpoints: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  endpoint: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  endpointActive: { borderColor: colors.accent },
  endpointText: { fontSize: 12, fontWeight: '600', color: colors.text },
  actionRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  sendBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
  },
  sendBtnBusy: { opacity: 0.9 },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  sideBtnText: { fontSize: 14, fontWeight: '600', color: colors.text },
  cancelText: { fontSize: 14, fontWeight: '600', color: colors.failure },
  result: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.card,
    gap: 4,
    minHeight: 0,
  },
  resultFlex: { flex: 1, justifyContent: 'center' },
  resultTitle: { fontSize: 17, fontWeight: '800' },
  resultSub: { fontSize: 13, color: colors.textMuted, lineHeight: 17 },
  meta: { fontSize: 12, color: colors.textDim, fontWeight: '600', marginTop: 4 },
  endpointMeta: { fontSize: 11, color: colors.textDim, marginTop: 'auto' },
});
