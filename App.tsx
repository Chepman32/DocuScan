// App.tsx - Main application entry point
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ViewerScreen } from './src/screens/ViewerScreen';

// Services
import { db } from './src/services/database';

// Stores
import { useIAPStore } from './src/stores/iapStore';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const { initializeIAP } = useIAPStore();

  useEffect(() => {
    // Initialize database
    db.init().catch((error) => {
      console.error('Database initialization failed:', error);
    });

    // Initialize IAP
    initializeIAP().catch((error) => {
      console.error('IAP initialization failed:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          initialRouteName="Library"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
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
            }}
          />
          <Stack.Screen
            name="Viewer"
            component={ViewerScreen}
            options={{
              title: 'Document Viewer',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
