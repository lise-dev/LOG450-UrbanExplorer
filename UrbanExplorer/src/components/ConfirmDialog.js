import React from 'react';
import { Dialog, Portal, Button } from 'react-native-paper';

const ConfirmDialog = ({
                           visible,
                           title = 'Confirmer',
                           confirmLabel = 'Confirmer',
                           cancelLabel = 'Annuler',
                           onCancel,
                           onConfirm,
                           confirmColor = 'red',
                           onDismiss,
                           children,
                       }) => {
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss || (() => {})}
                style={{ borderRadius: 12 }}
            >
                <Dialog.Title style={{ textAlign: 'center' }}>{title}</Dialog.Title>
                <Dialog.Content>{children}</Dialog.Content>
                <Dialog.Actions>
                    {onCancel && <Button onPress={onCancel}>{cancelLabel}</Button>}
                    <Button onPress={onConfirm} textColor={confirmColor}>
                        {confirmLabel}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ConfirmDialog;
