import {Credentials} from '../types/LocalTypes';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input, Button} from '@rneui/base';
import { useFile, useMedia } from '../hooks/apiHooks';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useUpdateContext } from '../hooks/UpdateHook';

const Upload = () => {
  const { postExpoFile } = useFile();
  const { postMedia } = useMedia();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const initValues = {title: '', description: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: initValues,
  });

  const resetForm = () => {
    reset();
    setImage(null);
  }

  const doUpload = async (inputs: {
    title: string;
    description: string;
}) => {
  if (!image) {
    Alert.alert('No media selected');
    return;
  }
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const fileResponse = await postExpoFile(image.assets![0].uri, token);
      const mediaResponse = await postMedia(fileResponse, inputs, token);
      setUpdate(!update);
      Alert.alert(mediaResponse.message);
      navigation.navigate('Home');
      resetForm();
    }
  } catch (error) {
    Alert.alert('doUpload failed');
  }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
  const unsubscribe = navigation.addListener('blur', () => {
    resetForm();
  });
  return unsubscribe
  }, []);


  return (
    <ScrollView>
    <TouchableOpacity
     onPress={() => Keyboard.dismiss()}
     style={{flex: 1}}
     activeOpacity={1}
   >

    <Card>
      {image && image.assets![0].mimeType?.includes('video') ? (
        <Video
          source={{uri: image.assets![0].uri}}
          style={{height: 300}}
          useNativeControls
          />
      ) : (
      <Card.Image onPress={pickImage}
        source={{uri: image ? image.assets![0].uri : 'https://via.placeholder.com/150?text=Choose+media'}} />
      )}
      <Card.Divider />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.title?.message}
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.description?.message}
            multiline={true}
            numberOfLines={5}
            style={{height: 120, textAlignVertical: 'top'}}
          />
        )}
        name="description"
      />
      <Button title="Choose Media" onPress={pickImage} />
      <Card.Divider />
      <Button title="Upload" onPress={handleSubmit(doUpload)} />
      <Card.Divider />
      <Button title="Reset" onPress={resetForm} />
    </Card>

    </TouchableOpacity>
    </ScrollView>
  );
};

export default Upload