import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentDetailPage.module.scss';
import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';
import { useParams } from 'react-router-dom';
import { appointmentDetailReducer } from '../../model/slices/appoimentDetailSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchAppoimentsByClientId } from '../../model/services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';
import { useSelector } from 'react-redux';
import {
    getAppoimetDetailsError,
    getAppoimetDetailsIsLoading,
    getAppoimetDetailsPageData,
} from '../../model/selectors/appoimentDetailsSelectors';
import { AppoimentDetails } from '@/entities/Appointment';
import { VStack } from '@/shared/ui/Stack';

interface AppoimentDetailPageProps {
    className?: string;
}

const reducers: ReducersList = {
    appoimentDetails: appointmentDetailReducer,
};

const AppoimentDetailPage = ({ className }: AppoimentDetailPageProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getAppoimetDetailsIsLoading);
    const error = useSelector(getAppoimetDetailsError);
    const appoiment = useSelector(getAppoimetDetailsPageData);

    const { id } = useParams<{ id: string }>();

    useInitialEffect(() => {
        dispatch(fetchAppoimentsByClientId(id));
    });

    if (!id) {
        return null;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.AppoimentDetailPage, {}, [className])}>
                <VStack gap="24" max>
                    <Text title={t('Детали сеанса')} bold />
                    <AppoimentDetails appoiment={appoiment} isLoading={isLoading} error={error} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(AppoimentDetailPage);
