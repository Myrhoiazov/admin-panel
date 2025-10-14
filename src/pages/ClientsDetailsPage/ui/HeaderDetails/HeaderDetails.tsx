import { AppoimentFormModal } from '@/features/addAppoimentForm';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { HStack } from '@/shared/ui/Stack';
import { Icon } from '@/shared/ui/Icon/Icon';
import Sessions from '@/shared/assets/icons/sessions.svg';
import s from './HeaderDetails.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsByClientId } from '../../model/services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';

interface HeaderDetailsProps {
    className?: string;
    userId?: string;
}

const HeaderDetails = (props: HeaderDetailsProps) => {
    const { className, userId } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isAddClientModal, setIsAddClientModal] = useState(false);

    const onBackToList = useCallback(() => {
        navigate(RoutePath.clients);
    }, [navigate]);

    const onCloseModal = useCallback(() => {
        setIsAddClientModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAddClientModal(true);
    }, []);

    const reloadPage = useCallback(() => {
        dispatch(fetchAppoimentsByClientId(userId || ''));
    }, [dispatch]);

    return (
        <div className={classNames(s.HeaderDetails, {}, [className])}>
            <HStack justify="between" gap="16" max>
                <Button theme={ButtonTheme.OUTLINE} onClick={onBackToList}>
                    {t('Назад к списку')}
                </Button>
                <Button onClick={onShowModal} className={s.btn}>
                    {t('Создать запись')}
                    <Icon Svg={Sessions} width={24} color="fill" />
                </Button>
            </HStack>
            <AppoimentFormModal
                userId={userId}
                isOpen={isAddClientModal}
                onClose={onCloseModal}
                reloadPage={reloadPage}
            />
        </div>
    );
};

export default memo(HeaderDetails);
