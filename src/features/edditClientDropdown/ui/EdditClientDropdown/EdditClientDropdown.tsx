import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback, useState } from 'react';
import { getRouteClientDetails, getRouteClients } from '@/shared/const/router';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Dropdown } from '@/shared/ui/Popups';
import { Icon } from '@/shared/ui/Icon/Icon';
import Eddit from '@/shared/assets/icons/edit-icon.svg';
import { deleteClientById } from '../../model/services/deleteClientById';
import { toast } from 'react-toastify';
import { ClientFormModal } from '@/features/addClientForm';
import { ConfirmActionModal } from '@/features/confirmAction';
import { useTranslation } from 'react-i18next';

interface EdditClientDropdownProps {
    className?: string;
    clientId: string;
    reloadPage?: () => void;
}

export const EdditClientDropdown = memo((props: EdditClientDropdownProps) => {
    const { className, clientId, reloadPage } = props;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const deleteClientGandler = useCallback(async () => {
        const result = await dispatch(deleteClientById(clientId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
            toast.info('Клиент успешно удален');
            setIsDeleteConfirmOpen(false);
        }
    }, [dispatch, clientId, reloadPage]);

    const onOpenEditModal = useCallback(() => {
        setIsEditOpen(true);
    }, []);

    const onCloseEditModal = useCallback(() => {
        setIsEditOpen(false);
    }, []);

    const onOpenDeleteConfirm = useCallback(() => {
        setIsDeleteConfirmOpen(true);
    }, []);

    const onCloseDeleteConfirm = useCallback(() => {
        setIsDeleteConfirmOpen(false);
    }, []);

    const items = [
        {
            content: 'Процедуры',
            href: getRouteClients(),
        },
        {
            content: 'Редактировать',
            onClick: onOpenEditModal,
        },
        {
            content: 'Просмотреть',
            href: getRouteClientDetails(String(clientId)),
        },
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
            <ClientFormModal
                isOpen={isEditOpen}
                onClose={onCloseEditModal}
                clientId={clientId}
                reloadPage={reloadPage}
            />
            <ConfirmActionModal
                isOpen={isDeleteConfirmOpen}
                onClose={onCloseDeleteConfirm}
                onConfirm={deleteClientGandler}
                title={t('Вы уверены, что хотите удалить клиента?')}
                description={t('Это действие нельзя отменить.')}
                cancelText={t('Отменить')}
                confirmText={t('Удалить')}
            />
        </>
    );
});
