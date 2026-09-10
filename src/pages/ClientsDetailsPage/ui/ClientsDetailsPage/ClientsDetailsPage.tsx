import React, { memo, useCallback, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ClientsDetailsPage.module.scss';
import { ClientDetails } from '@/entities/Client';
import { useParams } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { VStack } from '@/shared/ui/Stack';
import { clientDetailsCommentsReducer } from '../../model/slices/clientDetailsCommentsSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { ClientDetailsComments } from '../ClientDetailsComments/ClientDetailsComments';
import { ClientAppoiments } from '../ClientAppoiments/ClientAppoiments';
import { clientDetailsAppointmentsReducer } from '../../model/slices/clientDetailsAppoimentsSlice';
import HeaderDetails from '../HeaderDetails/HeaderDetails';

interface ClientsDetailsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    clientDetailsComments: clientDetailsCommentsReducer,
    clientDetailsAppointments: clientDetailsAppointmentsReducer,
};

const ClientsDetailsPage = ({ className }: ClientsDetailsPageProps) => {
    const { id } = useParams<{ id: string }>();
    const [clientRefreshVersion, setClientRefreshVersion] = useState(0);

    if (!id) {
        return null;
    }

    const onClientUpdated = useCallback(() => {
        setClientRefreshVersion((prev) => prev + 1);
    }, []);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.ClientsDetailsPage, {}, [className])}>
                <VStack gap="16" max>
                    <HeaderDetails userId={id} onClientUpdated={onClientUpdated} />
                    <ClientDetails id={id} refreshVersion={clientRefreshVersion} />
                    <ClientAppoiments id={id} />
                    <ClientDetailsComments id={id} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ClientsDetailsPage);
