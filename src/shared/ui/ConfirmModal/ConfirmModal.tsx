import React, { memo } from 'react';
import { Modal } from '../Modal/Modal';
import { Text } from '../Text/Text';
import { Button, ButtonTheme } from '../Button';
import { HStack, VStack } from '../Stack';
import cls from './ConfirmModal.module.scss';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = memo((props: ConfirmModalProps) => {
    const {
        isOpen,
        title = 'Подтверждение',
        message,
        confirmText = 'Удалить',
        cancelText = 'Отмена',
        onConfirm,
        onCancel,
    } = props;

    return (
        <Modal isOpen={isOpen} onClose={onCancel} lazy>
            <VStack gap="24" className={cls.ConfirmModal}>
                <VStack gap="8">
                    <Text title={title} size="m" bold />
                    <Text text={message} className={cls.message} />
                </VStack>
                <HStack gap="8" justify="end" max>
                    <Button theme={ButtonTheme.OUTLINE} onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button theme={ButtonTheme.OUTLINE_RED} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    );
});
