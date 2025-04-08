import React, { useState, forwardRef, useImperativeHandle } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Text} from 'react-native';
import ConfirmDialog from './ConfirmDialog';

const ImagePickerComponent = forwardRef(({ onImagePicked }, ref) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    const requestPermission = async (type) => {
        const permissionFn =
            type === 'camera'
                ? ImagePicker.requestCameraPermissionsAsync
                : ImagePicker.requestMediaLibraryPermissionsAsync;

        const { status } = await permissionFn();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', `Autorisation requise pour la ${type}.`);
            return false;
        }
        return true;
    };

    const launch = async (type) => {
        if (!(await requestPermission(type))) return;

        const pickFn =
            type === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

        const result = await pickFn({
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1.0,
        });

        if (!result.canceled) {
            onImagePicked(result.assets[0].uri);
        }
    };

    useImperativeHandle(ref, () => ({
        openPicker: () => setDialogVisible(true),
    }));

    const handleConfirm = async () => {
        setDialogVisible(false);
      await launch('camera');
    };

    const handleCancel = async () => {
        setDialogVisible(false);
        await launch('gallery');
    };

    return (
        <>
            <ConfirmDialog
                visible={dialogVisible}
                title="Source de l’image"
                confirmLabel="Caméra"
                cancelLabel="Galerie"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onDismiss={() => setDialogVisible(false)}
                confirmColor="blue"
            >
                <Text>Choisissez une option pour la photo</Text>
            </ConfirmDialog>
        </>
    );
});

export default ImagePickerComponent;
