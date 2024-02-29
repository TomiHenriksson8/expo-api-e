import {Button, Text, View} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const { handleLogout } = useUserContext();

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Profile;
