import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './contexts/UserContext';
import { UpdateProvider } from './contexts/UpdateContext';

const App = () => {
  return (
    <UserProvider>
      <UpdateProvider>
        <Navigator />
        <StatusBar style="auto" />
      </UpdateProvider>
    </UserProvider>
  );
};

export default App;
