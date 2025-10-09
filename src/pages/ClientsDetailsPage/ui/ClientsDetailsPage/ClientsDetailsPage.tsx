import React, { memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ClientsDetailsPage.module.scss';
import { ClientDetails } from 'entities/Client';
import { useParams } from 'react-router-dom';
import { Page } from 'widgets/Page/Page';
import { VStack } from 'shared/ui/Stack';
import { clientDetailsCommentsReducer } from '../../model/slices/clientDetailsCommentsSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
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

    if (!id) {
        return null;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page className={classNames(s.ClientsDetailsPage, {}, [className])}>
                <VStack gap="16" max>
                    <HeaderDetails userId={id} />
                    <ClientDetails id={id} />
                    <ClientAppoiments id={id} />
                    <ClientDetailsComments id={id} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ClientsDetailsPage);
