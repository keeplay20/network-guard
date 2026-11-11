import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Send, RotateCcw } from 'lucide-react-native';
import { MOCK_ENDPOINTS } from '../constants/networkConditions';
import { colors, spacing } from '../constants/theme';
import { useNetworkStore, selectEndpoint } from '../store/networkStore';
import { REQUEST_STATUS } from '../utils/requestStatusText';
import { formatDuration } from '../utils/formatTime';

const TONE_COLORS = {
  muted: colors.textMuted,
  warning: colors.warning,
  success: colors.success,
  error: colors.failure,
};

export default function RequestSimulator() {
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
    <View style={styles.wrap}>
      <Text style={styles.heading}>Step 2 — Send a test request</Text>
      <Text style={styles.help}>Pretend your app is calling an API (nothing leaves this phone).</Text>

      <Text style={styles.fieldLabel}>Which API?</Text>
      <View style={styles.endpointRow}>
        {MOCK_ENDPOINTS.map((item) => {
          const active = selectedEndpointId === item.id;
          return (
            <Pressable
              key={item.id}
              disabled={isRequestInFlight}
              onPress={() => setSelectedEndpoint(item.id)}
              style={[styles.endpointChip, active && styles.endpointChipActive]}
            >
              <Text style={styles.path}>{item.path}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={isRequestInFlight}
        onPress={sendRequest}
        style={({ pressed }) => [
          styles.primaryBtn,
          isRequestInFlight && styles.primaryBtnLoading,
          pressed && !isRequestInFlight && { opacity: 0.92 },
        ]}
      >
        {isRequestInFlight ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Send size={18} color="#fff" />
        )}
        <Text style={styles.primaryBtnText}>
          {isRequestInFlight ? 'Sending…' : 'Send'}
        </Text>
      </Pressable>

      {isRequestInFlight && (
        <Pressable onPress={cancelRequest} style={styles.cancelLink}>
          <Text style={styles.cancelText}>Stop this request</Text>
        </Pressable>
      )}

      {!isRequestInFlight && requestState === 'error' && (
        <Pressable onPress={retryLastRequest} style={styles.retryBtn}>
          <RotateCcw size={16} color={colors.text} />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      )}

      <View style={[styles.resultBox, { borderColor: toneColor + '55' }]}>
        <Text style={styles.step3Label}>Step 3 — Result</Text>
        <Text style={[styles.resultHeadline, { color: toneColor }]}>{status.headline}</Text>
        <Text style={styles.resultSub}>{status.sub}</Text>
        {response?.errorMessage && (
          <Text style={styles.errorDetail}>{response.errorMessage}</Text>
        )}
        {response?.statusCode != null && response.statusCode > 0 && (
          <Text style={styles.meta}>
            HTTP {response.statusCode}
            {response.durationMs != null ? ` · ${formatDuration(response.durationMs)}` : ''}
          </Text>
        )}
        {requestState === 'success' && response?.body && (
          <Text style={styles.jsonPreview} numberOfLines={4}>
            {JSON.stringify(response.body)}
          </Text>
        )}
        <Text style={styles.endpointHint}>Testing: {endpoint.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: { fontSize: 16, fontWeight: '700', color: colors.text },
  help: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginTop: -4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textDim },
  endpointRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  endpointChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  endpointChipActive: {
    borderColor: colors.accent,
    backgroundColor: '#1C2233',
  },
  path: { fontSize: 13, color: colors.text, fontWeight: '600' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnLoading: { opacity: 0.9 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelLink: { alignSelf: 'center' },
  cancelText: { fontSize: 13, color: colors.failure, fontWeight: '600' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  retryText: { fontSize: 14, fontWeight: '600', color: colors.text },
  resultBox: {
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.background,
    gap: 6,
  },
  step3Label: { fontSize: 11, fontWeight: '700', color: colors.textDim, textTransform: 'uppercase' },
  resultHeadline: { fontSize: 18, fontWeight: '800' },
  resultSub: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  errorDetail: { fontSize: 13, color: colors.failure, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.textDim, fontWeight: '600' },
  jsonPreview: { fontSize: 11, color: colors.textMuted, fontFamily: 'Menlo', marginTop: 4 },
  endpointHint: { fontSize: 11, color: colors.textDim, marginTop: 4 },
});
