import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import AppNavigator from './src/routes/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

export default gestureHandlerRootHOC(App);

