import React, { memo, useCallback } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ClientsDetailsPage.module.scss';
import { ClientDetails } from 'entities/Client';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'widgets/Page/Page';
import { Button, ButtonTheme } from 'shared/ui/Button';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { VStack } from 'shared/ui/Stack';
import { clientDetailsCommentsReducer } from '../../model/slices/clientDetailsCommentsSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { ClientDetailsComments } from '../ClientDetailsComments/ClientDetailsComments';

interface ClientsDetailsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    clientDetailsComments: clientDetailsCommentsReducer,
};

const ClientsDetailsPage = ({ className }: ClientsDetailsPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        return null;
    }

    const onBackToList = useCallback(() => {
        navigate(RoutePath.clients);
    }, [navigate]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.ClientsDetailsPage, {}, [className])}>
                <VStack gap="16" max>
                    <VStack align="end">
                        <Button theme={ButtonTheme.OUTLINE} onClick={onBackToList}>
                            Назад к списку
                        </Button>
                    </VStack>
                    <ClientDetails id={id} />
                    <ClientDetailsComments id={id} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ClientsDetailsPage);
