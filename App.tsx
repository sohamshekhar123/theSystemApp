// Solo Leveling System App - Main Entry Point
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Rajdhani_400Regular,
  Rajdhani_500Medium,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from '@expo-google-fonts/rajdhani';
import { GameProvider, useGame } from './src/context/GameContext';
import { AwakeningScreen, HUDScreen, PenaltyScreen } from './src/screens';
import { usePenaltyCheck } from './src/hooks/usePenaltyCheck';
import { colors, fontSizes } from './src/styles/theme';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Main App Content (uses GameContext)
const AppContent: React.FC = () => {
  const { state, isLoading } = useGame();
  const { isPenaltyActive, completePenalty } = usePenaltyCheck();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.electricCyan} />
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    );
  }

  // Show penalty screen if active
  if (isPenaltyActive) {
    return <PenaltyScreen onComplete={completePenalty} />;
  }

  // Show awakening for first-time users
  if (state.isFirstLaunch) {
    return <AwakeningScreen />;
  }

  // Main HUD
  return <HUDScreen />;
};

// Root App Component
export default function App() {
  const [fontsLoaded] = useFonts({
    'Rajdhani-Regular': Rajdhani_400Regular,
    'Rajdhani-Medium': Rajdhani_500Medium,
    'Rajdhani-SemiBold': Rajdhani_600SemiBold,
    'Rajdhani-Bold': Rajdhani_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.electricCyan} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.voidBlack,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.voidBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: fontSizes.lg,
    color: colors.electricCyan,
    marginTop: 16,
    letterSpacing: 2,
  },
});
