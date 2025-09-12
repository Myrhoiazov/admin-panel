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

import { Icon } from 'shared/ui/Icon/Icon';
import { HStack } from 'shared/ui/Stack';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsList } from '../../model/services/fetchAppoimentsList/fetchAppoimentsList';
import { initAppoimentPage } from '../../model/services/initAppoimentPage/initAppoimentPage';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useSearchParams } from 'react-router-dom';
import { AppoimentList } from 'entities/Appointment';
import { useSelector } from 'react-redux';
import { AppoimentFilters } from 'widgets/AppoimentFilters';
import { FiltersContainer } from '../FiltersContainer/FiltersContainer';

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
                    <FiltersContainer reloadPage={fetchAllAppointments} />
                </HStack>
                <AppoimentList appoiments={appoiments} />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(AppoimentsPage);
