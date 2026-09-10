import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Dropdown } from '@/shared/ui/Popups';
import { Icon } from '@/shared/ui/Icon/Icon';
import Eddit from '@/shared/assets/icons/edit-icon.svg';
import { deleteTransactionById } from '../../model/services/deleteTransactionById';
import { toast } from 'react-toastify';
import { ConfirmActionModal } from '@/features/confirmAction';

interface EdditTransactionDropdownProps {
    className?: string;
    transactionId: string;
    reloadPage?: () => void;
}

export const EdditTransactionDropdown = memo((props: EdditTransactionDropdownProps) => {
    const { className, transactionId, reloadPage } = props;
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const dispatch = useAppDispatch();

    const deleteTransactionHandler = useCallback(async () => {
        const result = await dispatch(deleteTransactionById(transactionId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
            toast.info('Транзакция успешно удалена');
            setIsDeleteConfirmOpen(false);
        }
    }, [dispatch, reloadPage, transactionId]);

    const onOpenDeleteConfirm = useCallback(() => {
        setIsDeleteConfirmOpen(true);
    }, []);

    const onCloseDeleteConfirm = useCallback(() => {
        setIsDeleteConfirmOpen(false);
    }, []);

    const items = [
        {
            content: 'Удалить',
            onClick: onOpenDeleteConfirm,
        },
    ];

    return (
        <>
            <Dropdown
                direction="bottom left"
                className={classNames('', {}, [className])}
                items={items}
                trigger={<Icon Svg={Eddit} width={24} height={24} color="stroke" />}
            />
            <ConfirmActionModal
                isOpen={isDeleteConfirmOpen}
                onClose={onCloseDeleteConfirm}
                onConfirm={deleteTransactionHandler}
                title="Удалить транзакцию?"
                description="Это действие нельзя отменить."
                cancelText="Отменить"
                confirmText="Удалить"
            />
        </>
    );
});
