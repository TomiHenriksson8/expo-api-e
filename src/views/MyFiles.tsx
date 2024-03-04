import {FlatList} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import { useUserContext } from '../hooks/ContextHooks';
import { View } from 'react-native';
import { Text } from '@rneui/base';

const MyFiles = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray} = useMedia();
  const { user } = useUserContext();

  if (!user) {
    return (
      <View>
        <Text>No Media item uploaded yet.</Text>
      </View>
    );
  }

  const myMedia = mediaArray.filter((item) => item.user_id === user.user_id);

  return (
    <>
      <FlatList
        data={myMedia}
        renderItem={({item}) => (
          <MediaListItem navigation={navigation} item={item} />
        )}
      />
    </>
  );
};

export default MyFiles;
