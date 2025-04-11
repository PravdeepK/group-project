import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ScoreboardScreen from './screens/ScoreboardScreen';
import TestScreen from './screens/TestScreen';
import TestHistoryScreen from './screens/TestHistoryScreen';
import RetryFailedScreen from './screens/RetryFailedScreen';
import TryNewQuestionsScreen from './screens/TryNewQuestionsScreen';

import { seedNotCompleted } from './utils/seedNotCompleted'; // ✅ import

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    seedNotCompleted(); // ✅ run once at startup
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="RetryFailed" component={RetryFailedScreen} />
        <Stack.Screen name="TryNewQuestions" component={TryNewQuestionsScreen} />
        <Stack.Screen name="Scoreboard" component={ScoreboardScreen} />
        <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
