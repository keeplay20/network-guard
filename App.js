import { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from './src/constants/theme';
import { useNetworkStore } from './src/store/networkStore';
import TabBar from './src/components/TabBar';
import TestScreen from './src/screens/TestScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [tab, setTab] = useState('test');
  const init = useNetworkStore((s) => s.init);
  const { width } = useWindowDimensions();
  const contentWidth = Platform.OS === 'web' ? Math.min(width, 520) : width;

  useEffect(() => {
    const unsub = init();
    return () => unsub?.();
  }, [init]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar style="light" />
          <View style={styles.shell}>
            <View style={[styles.content, { width: contentWidth, maxWidth: '100%' }]}>
              {tab === 'test' && <TestScreen />}
              {tab === 'settings' && <SettingsScreen />}
            </View>
          </View>
          <TabBar active={tab} onChange={setTab} />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1, backgroundColor: colors.background },
  shell: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
