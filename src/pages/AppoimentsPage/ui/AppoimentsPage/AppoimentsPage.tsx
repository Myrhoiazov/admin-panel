import React, { memo, useCallback, useState } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './AppoimentsPage.module.scss';
import { Page } from 'widgets/Page/Page';
import { Text } from 'shared/ui/Text/Text';
import { AppoimentFormModal } from 'features/addAppoimentForm';

import { appoimentsPageReducer, getAppointments } from '../../model/slices/appoimentsPageSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Button } from 'shared/ui/Button';
import { useTranslation } from 'react-i18next';
import Sessions from 'shared/assets/icons/sessions.svg';

import { Icon } from 'shared/ui/Icon/Icon';
import { HStack } from 'shared/ui/Stack';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsList } from '../../model/services/fetchAppoimentsList/fetchAppoimentsList';
import { initAppoimentPage } from '../../model/services/initAppoimentPage/initAppoimentPage';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useSearchParams } from 'react-router-dom';
import { AppoimentList } from 'entities/Appointment';
import { useSelector } from 'react-redux';

interface AppoimentsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    appoimentPage: appoimentsPageReducer,
};

const AppoimentsPage = ({ className }: AppoimentsPageProps) => {
    const [isAddClientModal, setIsAddClientModal] = useState(false);
    const dispatch = useAppDispatch();
    const appoiments = useSelector(getAppointments.selectAll);
    const [searchParams] = useSearchParams();

    const { t } = useTranslation();

    const onCloseModal = useCallback(() => {
        setIsAddClientModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAddClientModal(true);
    }, []);

    useInitialEffect(() => {
        dispatch(initAppoimentPage(searchParams));
    });

    const fetchAllAppointments = useCallback(() => {
        dispatch(fetchAppoimentsList({ replace: true, noQuery: true }));
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.AppoimentPage, {}, [className])}>
                <HStack gap="32" justify="between" align="center" max>
                    <Text title="Список сеансов" bold />
                    <Button onClick={onShowModal} className={s.btn}>
                        {t('Создать запись')}
                        <Icon Svg={Sessions} width={24} color="fill" />
                    </Button>
                </HStack>
                <AppoimentList appoiments={appoiments} />
                <AppoimentFormModal
                    isOpen={isAddClientModal}
                    onClose={onCloseModal}
                    reloadPage={fetchAllAppointments}
                />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(AppoimentsPage);
