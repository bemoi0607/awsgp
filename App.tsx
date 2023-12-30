import React from 'react';
import { SafeAreaView, StyleSheet,Text } from 'react-native';
import LogIn from './screens/LogInScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LogIn/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;