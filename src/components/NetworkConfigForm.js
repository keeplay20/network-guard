import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing } from '../constants/theme';

function LabeledSlider({ label, value, min, max, step, unit, onChange }) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>
        {label}: {Math.round(value)}
        {unit || ''}
      </Text>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.cardBorder}
        thumbTintColor={colors.accent}
      />
    </View>
  );
}

export default function NetworkConfigForm({ config, onChange }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.note}>Approximate custom tuning (does not change device radio).</Text>
      <LabeledSlider
        label="Latency"
        value={config.latencyMs}
        min={0}
        max={3000}
        step={50}
        unit="ms"
        onChange={(latencyMs) => onChange({ latencyMs })}
      />
      <LabeledSlider
        label="Jitter"
        value={config.jitterMs}
        min={0}
        max={500}
        step={10}
        unit="ms"
        onChange={(jitterMs) => onChange({ jitterMs })}
      />
      <LabeledSlider
        label="Download"
        value={config.downloadKbps}
        min={0}
        max={20000}
        step={50}
        unit=" kbps"
        onChange={(downloadKbps) => onChange({ downloadKbps })}
      />
      <LabeledSlider
        label="Upload"
        value={config.uploadKbps}
        min={0}
        max={10000}
        step={50}
        unit=" kbps"
        onChange={(uploadKbps) => onChange({ uploadKbps })}
      />
      <LabeledSlider
        label="Packet loss"
        value={config.packetLossPercent}
        min={0}
        max={50}
        step={1}
        unit="%"
        onChange={(packetLossPercent) => onChange({ packetLossPercent })}
      />
      <LabeledSlider
        label="Random failure"
        value={(config.failureProbability || 0) * 100}
        min={0}
        max={80}
        step={5}
        unit="%"
        onChange={(v) => onChange({ failureProbability: v / 100 })}
      />
      <LabeledSlider
        label="Connection timeout"
        value={config.connectionTimeoutMs}
        min={3000}
        max={60000}
        step={1000}
        unit="ms"
        onChange={(connectionTimeoutMs) => onChange({ connectionTimeoutMs })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  note: { fontSize: 11, color: colors.textDim, marginBottom: spacing.xs },
  block: { marginBottom: spacing.xs },
  label: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 0 },
});
