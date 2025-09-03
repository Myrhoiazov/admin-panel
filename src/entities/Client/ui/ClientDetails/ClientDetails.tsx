import React, { memo, useEffect } from 'react';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { clientDetailsReducer } from '../../model/slice/clientDetailsSlice';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchClientById } from '../../model/services/fetchClientById/fetchClientById';
import { useSelector } from 'react-redux';
import {
    getClientDetailsData,
    getClientDetailsError,
    getClientDetailsIsLoading,
} from '../../model/selectors/clientDetails';
import { AppImage } from 'shared/ui/AppImage';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';
import { Card } from 'shared/ui/Card/Card';
import { Skeleton } from 'shared/ui/Skeleton/Skeleton';
import s from './ClientDetails.module.scss';

interface ClientDetailsProps {
    // className?: string;
    id: string;
}

const reducers: ReducersList = {
    clientDetails: clientDetailsReducer,
};

const ClientElementSkeleton = () => {
    return (
        <Card className={s.card} padding="32" fullWidth>
            <HStack gap="32" max align="start">
                <VStack gap="16" max>
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                </VStack>
                <Skeleton width={400} height={400} border="10%" />
            </HStack>
        </Card>
    );
};

const ClientElement = () => {
    const client = useSelector(getClientDetailsData);

    return (
        <Card padding="32" fullWidth>
            <HStack gap="32" max align="start" justify="between">
                <VStack gap="16">
                    <HStack gap="16" align="start">
                        <Text title="Имя и Фамилия:" size="s" bold className={s.title} />
                        <Text title={`${client?.firstName} ${client?.lastName}`} size="s" />
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="День Рождения:" size="s" bold className={s.title} />
                        <Text title={`${client?.birthday}`} size="s" />
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Email:" size="s" bold className={s.title} />
                        <Text title={`${client?.email}`} size="s" />
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Тел:" size="s" bold className={s.title} />
                        <Text title={`${client?.phoneNumber}`} size="s" />
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Наличие 3D фото:" size="s" bold className={s.title} />
                        {client?.image_3d ? (
                            <Text title="YES" size="s" />
                        ) : (
                            <Text title="-" size="s" />
                        )}
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Статус:" size="s" bold className={s.title} />
                        {client?.status ? (
                            <Text title={`${client?.status}`} size="s" />
                        ) : (
                            <Text title="Не определен" size="s" />
                        )}
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Анамнез пациента:" size="s" bold className={s.title} />
                        {client?.anamnesis ? (
                            <Text title={`${client?.anamnesis}`} size="s" />
                        ) : (
                            <Text title="Не определен" size="s" />
                        )}
                    </HStack>
                    <HStack gap="16" align="start">
                        <Text title="Характеристики пациента:" size="s" bold className={s.title} />
                        {client?.description ? (
                            <Text title={`${client?.description}`} size="s" />
                        ) : (
                            <Text title="Пока не определены" size="s" />
                        )}
                    </HStack>
                </VStack>
                <span className={s.imageWrapper}>
                    <AppImage
                        src={client?.image as string}
                        alt={client?.firstName}
                        width={300}
                        className={s.image}
                    />
                </span>
            </HStack>
        </Card>
    );
};

export const ClientDetails = memo((props: ClientDetailsProps) => {
    const { id } = props;
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getClientDetailsIsLoading);
    const error = useSelector(getClientDetailsError);

    useEffect(() => {
        if (id) {
            dispatch(fetchClientById(id));
        }
    }, [dispatch, id]);

    let content;

    if (isLoading) {
        content = <ClientElementSkeleton />;
    } else if (error) {
        content = <Text title="Клиента не существует" align="center" />;
    } else {
        content = <ClientElement />;
    }

    return <DynamicModuleLoader reducers={reducers}>{content}</DynamicModuleLoader>;
});
