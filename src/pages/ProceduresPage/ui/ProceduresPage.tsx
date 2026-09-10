import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProceduresPage.module.scss';
import { Page } from '@/widgets/Page/Page';
import { AppLink, AppLinkTheme } from '@/shared/ui/AppLink/AppLink';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { fetchProceduresList } from '../model/services/fetchProceduresList/fetchProceduresList';
import { deleteProcedure } from '../model/services/deleteProcedure/deleteProcedure';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getProcedures, proceduresPageReducer } from '../model/slices/proceduresPageSlice';
import { useSelector } from 'react-redux';
import { getProceduresPageIsLoading } from '../model/selectors/proceduresPageSelectors';
import { ProcedureList } from '@/entities/Procedure';
import { useTranslation } from 'react-i18next';
import { getUserAuthData } from '@/entities/User';

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
    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);
    const { t } = useTranslation();

    useInitialEffect(() => {
        dispatch(fetchProceduresList());
    });

    const onDelete = async (id: string) => {
        const result = await dispatch(deleteProcedure(id));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Процедура удалена');
        } else {
            toast.error('Не удалось удалить процедуру');
        }
    };

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.ProceduresPage, {}, [className])}>
                <div className={s.header}>
                    <Text title="Список процедур" size="l" className={s.title} bold />
                    {isAdmin && (
                        <AppLink
                            to={`${RoutePath.procedures_create}`}
                            className={s.addButton}
                            theme={AppLinkTheme.PRIMARY}
                        >
                            {t('Добавить новую процедуру')}
                        </AppLink>
                    )}
                </div>
                <ProcedureList procedures={procedures} isLoading={isLoading} onDelete={isAdmin ? onDelete : undefined} />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ProceduresPage);
