import { memo, useCallback, useState } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { classNames } from '@/shared/lib/classNames/classNames';
import { VStack, HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import cls from './ConfirmActionModal.module.scss';

interface ConfirmActionModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmActionModal = memo((props: ConfirmActionModalProps) => {
    const {
        className,
        isOpen,
        onClose,
        onConfirm,
        title,
        description,
        confirmText = 'Удалить',
        cancelText = 'Отменить',
        isLoading = false,
    } = props;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onConfirmHandler = useCallback(async () => {
        try {
            setIsSubmitting(true);
            await onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    }, [onConfirm]);

    const pending = isLoading || isSubmitting;

    return (
        <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose} lazy>
            <VStack gap="24" align="start" className={cls.ConfirmActionModal}>
                <Text title={title} size="m" bold />
                {description && <Text text={description} />}
                <HStack gap="16" justify="end" className={cls.actions} max>
                    <Button theme={ButtonTheme.OUTLINE} onClick={onClose} disabled={pending}>
                        {cancelText}
                    </Button>
                    <Button
                        theme={ButtonTheme.OUTLINE_RED}
                        onClick={onConfirmHandler}
                        disabled={pending}
                    >
                        {confirmText}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    );
});
