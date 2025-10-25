// App.tsx - Main application with complete navigation
import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ViewerScreen } from './src/screens/ViewerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ProUpgradeScreen } from './src/screens/ProUpgradeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

// Components
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LoadingSkeleton } from './src/components/LoadingSkeleton';

// Services
import { db } from './src/services/database';

// Stores
import { useIAPStore } from './src/stores/iapStore';
import { useLibraryStore } from './src/stores/libraryStore';

// Ignore specific warnings in production
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const { initializeIAP } = useIAPStore();
  const { loadDocuments, loadFolders } = useLibraryStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check onboarding status
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      setShowOnboarding(onboardingCompleted !== 'true');

      // Initialize database
      await db.init();
      console.log('✅ Database initialized');

      // Load initial data
      await Promise.all([
        loadDocuments(),
        loadFolders(),
      ]);
      console.log('✅ Initial data loaded');

      // Initialize IAP
      await initializeIAP();
      console.log('✅ IAP initialized');

      setIsInitialized(true);
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      setInitError(error as Error);
      // Still allow app to run with degraded functionality
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        {/* Loading state */}
        <LibraryScreen navigation={{ navigate: () => {} }} />
      </GestureHandlerRootView>
    );
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // In production: log to analytics/crash reporting
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <Stack.Navigator
            initialRouteName={showOnboarding ? 'Onboarding' : 'Library'}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            {/* Onboarding */}
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{
                animation: 'fade',
              }}
            />

            {/* Main Screens */}
            <Stack.Screen
              name="Library"
              component={LibraryScreen}
              options={{
                title: 'Documents',
              }}
            />

            <Stack.Screen
              name="Scan"
              component={ScanScreen}
              options={{
                title: 'Scan Document',
                animation: 'slide_from_bottom',
                presentation: 'fullScreenModal',
              }}
            />

            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{
                title: 'Review & Enhance',
                animation: 'slide_from_right',
              }}
            />

            <Stack.Screen
              name="Viewer"
              component={ViewerScreen}
              options={{
                title: 'Document Viewer',
                animation: 'slide_from_right',
              }}
            />

            {/* Settings & Pro */}
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: 'Settings',
                animation: 'slide_from_right',
              }}
            />

            <Stack.Screen
              name="ProUpgrade"
              component={ProUpgradeScreen}
              options={{
                title: 'DocuScan Pro',
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
