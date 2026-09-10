import { AppoimentFormModal } from '@/features/addAppoimentForm';
import { ClientFormModal } from '@/features/addClientForm';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { HStack } from '@/shared/ui/Stack';
import { Icon } from '@/shared/ui/Icon/Icon';
import Sessions from '@/shared/assets/icons/sessions.svg';
import { $apiPrivate } from '@/shared/api/api';
import s from './HeaderDetails.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsByClientId } from '../../model/services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';

interface HeaderDetailsProps {
    className?: string;
    userId?: string;
    onClientUpdated?: () => void;
}

const HeaderDetails = (props: HeaderDetailsProps) => {
    const { className, userId, onClientUpdated } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isAddClientModal, setIsAddClientModal] = useState(false);
    const [isEditClientModal, setIsEditClientModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const onBackToList = useCallback(() => {
        navigate(RoutePath.clients);
    }, [navigate]);

    const onCloseModal = useCallback(() => {
        setIsAddClientModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAddClientModal(true);
    }, []);

    const onOpenEditClientModal = useCallback(() => {
        setIsEditClientModal(true);
    }, []);

    const onCloseEditClientModal = useCallback(() => {
        setIsEditClientModal(false);
    }, []);

    const onClientSaveSuccess = useCallback(() => {
        setIsEditClientModal(false);
        onClientUpdated?.();
    }, [onClientUpdated]);

    const reloadPage = useCallback(() => {
        dispatch(fetchAppoimentsByClientId(userId || ''));
    }, [dispatch, userId]);

    const onExportClientCsv = useCallback(async () => {
        if (!userId) return;
        try {
            setIsExporting(true);
            const response = await $apiPrivate.get(
                `/clients/${userId}/export/csv`,
                { responseType: 'blob' },
            );
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `client-${userId}-export.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    }, [userId]);

    return (
        <div className={classNames(s.HeaderDetails, {}, [className])}>
            <HStack justify="between" gap="16" max>
                <Button theme={ButtonTheme.OUTLINE} onClick={onBackToList}>
                    {t('Назад к списку')}
                </Button>
                <HStack gap="8" className={s.actionsWrap}>
                    <Button
                        theme={ButtonTheme.OUTLINE}
                        onClick={onExportClientCsv}
                        disabled={isExporting}
                    >
                        {isExporting ? 'Экспорт...' : 'Экспорт CSV'}
                    </Button>
                    <Button theme={ButtonTheme.OUTLINE} onClick={onOpenEditClientModal}>
                        {t('Редактировать')}
                    </Button>
                    <Button onClick={onShowModal} className={s.btn}>
                        {t('Создать запись')}
                        <Icon Svg={Sessions} width={24} color="stroke" />
                    </Button>
                </HStack>
            </HStack>
            <AppoimentFormModal
                userId={userId}
                isOpen={isAddClientModal}
                onClose={onCloseModal}
                reloadPage={reloadPage}
            />
            <ClientFormModal
                isOpen={isEditClientModal}
                onClose={onCloseEditClientModal}
                clientId={userId}
                reloadPage={onClientSaveSuccess}
            />
        </div>
    );
};

export default memo(HeaderDetails);
