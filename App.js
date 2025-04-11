import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ScoreboardScreen from './screens/ScoreboardScreen';
import TestScreen from './screens/TestScreen';
import TestHistoryScreen from './screens/TestHistoryScreen'; // ✅ New screen for test history

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scoreboard" component={ScoreboardScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
