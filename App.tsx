import React from 'react';
import {NativeBaseProvider} from 'native-base'
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import Navigator from './stacks/Navigator';
import 'react-native-gesture-handler';

Amplify.configure(amplifyconfig);

const App: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
};



export default App;