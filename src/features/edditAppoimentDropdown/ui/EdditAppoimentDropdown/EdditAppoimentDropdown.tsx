import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Icon } from '@/shared/ui/Icon/Icon';
import TrashIcon from '@/shared/assets/icons/trash-icon.svg';
import { deleteAppoimentById } from '../../model/services/deleteAppoimentById';
import { toast } from 'react-toastify';
import { ConfirmActionModal } from '@/features/confirmAction';
import s from './EdditAppoimentDropdown.module.scss';

interface EdditAppoimentDropdownProps {
    className?: string;
    appointmentId: string;
    reloadPage?: () => void;
    canDelete?: boolean;
}

export const EdditAppoimentDropdown = memo((props: EdditAppoimentDropdownProps) => {
    const { className, appointmentId, reloadPage, canDelete = true } = props;
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleDelete = useCallback(async () => {
        const result = await dispatch(deleteAppoimentById(appointmentId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
            toast.info('Сеанс успешно удален');
            setIsDeleteConfirmOpen(false);
        }
    }, [appointmentId, dispatch, reloadPage]);

    if (!canDelete) return null;

    return (
        <>
            <button
                className={classNames(s.deleteBtn, {}, [className])}
                onClick={() => setIsDeleteConfirmOpen(true)}
                title="Удалить сеанс"
                aria-label="Удалить сеанс"
            >
                <Icon Svg={TrashIcon} width={18} height={18} color="fill" />
            </button>
            <ConfirmActionModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Удалить сеанс?"
                description="Это действие нельзя отменить."
                cancelText="Отменить"
                confirmText="Удалить"
            />
        </>
    );
});
