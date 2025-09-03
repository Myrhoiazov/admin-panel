import React, { memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ProceduresPage.module.scss';
import { Page } from 'widgets/Page/Page';
import { Link } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { fetchProceduresList } from '../model/services/fetchProceduresList/fetchProceduresList';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getProcedures, proceduresPageReducer } from '../model/slices/proceduresPageSlice';
import { useSelector } from 'react-redux';
import { getProceduresPageIsLoading } from '../model/selectors/proceduresPageSelectors';
import { ProcedureList } from 'entities/Procedure';
import { useTranslation } from 'react-i18next';

interface ProceduresPageProps {
    className?: string;
}

const reducers: ReducersList = {
    proceduresPage: proceduresPageReducer,
};

const ProceduresPage = ({ className }: ProceduresPageProps) => {
    const dispatch = useAppDispatch();
    const procedures = useSelector(getProcedures.selectAll);
    const isLoading = useSelector(getProceduresPageIsLoading);
    const { t } = useTranslation();

    useInitialEffect(() => {
        dispatch(fetchProceduresList());
    });

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.ProceduresPage, {}, [className])}>
                <Text title="Список процедур" size="l" bold />
                <VStack gap="16">
                    <Link to={`${RoutePath.procedures_create}`}>
                        {t('Добавить новую процедуру')}
                    </Link>
                </VStack>
                <ProcedureList procedures={procedures} isLoading={isLoading} />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ProceduresPage);
