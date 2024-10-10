import React from 'react';
import { Button, View, Alert, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';

const ImagePickerComponent = () => {

  // Request Camera Permission (for Android 6.0+)
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Open the gallery to select an image
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error: ', response.errorMessage);
      } else {
        // Handle the selected image
        console.log('Selected Image:', response.assets[0].uri);
        Alert.alert('Image selected from gallery');
      }
    });
  };

  // Open the camera to take a picture
  const openCamera = async () => {
    const cameraPermission = await requestCameraPermission();
    if (!cameraPermission) {
      Alert.alert('Camera permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: false,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error: ', response.errorMessage);
      } else {
        // Handle the captured image
        console.log('Captured Image:', response.assets[0].uri);
        Alert.alert('Image captured with camera');
      }
    });
  };

  return (
    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Text style={styles.buttonText}>Add Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Open Gallery</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      paddingBottom: 32,
    },
    button: {
      flex: 1,
      backgroundColor: '#006A6A',
      paddingVertical: 16,
      borderRadius: 12,
      marginHorizontal: 6,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#006A6A',
    },
    secondaryButtonText: {
      color: '#006A6A',
    }
});

export default ImagePickerComponent;