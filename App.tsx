import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Navigator />
      <StatusBar style="auto" />
    </UserProvider>
  );
};

export default App;
