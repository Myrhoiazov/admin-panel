import React, { memo, useEffect, Fragment } from 'react';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { clientDetailsReducer } from '../../model/slice/clientDetailsSlice';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchClientById } from '../../model/services/fetchClientById/fetchClientById';
import { useSelector } from 'react-redux';
import {
    getClientDetailsData,
    getClientDetailsError,
    getClientDetailsIsLoading,
} from '../../model/selectors/clientDetails';
import { AppImage } from '@/shared/ui/AppImage';
import { HStack, VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Card } from '@/shared/ui/Card/Card';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import s from './ClientDetails.module.scss';
import { Link } from 'react-router-dom';
import { ClientStatusKey, useClientStatusLabels } from '@/entities/ClientStatus';
import { QUESTIONNAIRE_ITEMS, parseQuestionnaire, formatQuestionnaireDate } from '../../model/consts/questionnaire';
import CheckBox from '@/shared/ui/CheckBox/CheckBox';

interface ClientDetailsProps {
    // className?: string;
    id: string;
    refreshVersion?: number;
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

interface QuestionnaireBlockProps {
    questionnaire?: string | null;
    image3d?: boolean;
}

const QuestionnaireBlock = ({ questionnaire, image3d }: QuestionnaireBlockProps) => {
    const data = parseQuestionnaire(questionnaire);

    const isChecked = (item: string) => {
        if (item in data) return true;
        if (item === 'Фото 3Д' && image3d) return true;
        return false;
    };

    return (
        <div className={s.questionnaireBlock}>
            <div className={s.questionnaireTitle}>Документы клиента</div>
            <div className={s.questionnaireGrid}>
                {QUESTIONNAIRE_ITEMS.map((item) => {
                    const checked = isChecked(item);
                    const dateStr = data[item] ? formatQuestionnaireDate(data[item]) : '';
                    return (
                        <div key={item} title={dateStr ? `Отмечено: ${dateStr}` : undefined}>
                            <CheckBox label={item} value={checked} readOnly compact />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ClientElement = () => {
    const client = useSelector(getClientDetailsData);
    const statusLabels = useClientStatusLabels();

    const clientStatus = client?.status
        ? statusLabels[client.status.toUpperCase() as ClientStatusKey]
        : '';

    return (
        <Card padding="32" fullWidth>
            <HStack gap="32" max align="start" justify="between">
                <VStack gap="16">
                    <HStack gap="32" align="start">
                        <Text title="Имя и Фамилия:" size="s" bold className={s.title} />
                        <Text title={`${client?.firstName} ${client?.lastName}`} size="s" />
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="День Рождения:" size="s" bold className={s.title} />
                        <Text title={`${client?.birthday}`} size="s" />
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="Email:" size="s" bold className={s.title} />
                        <Text title={`${client?.email}`} size="s" />
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="Тел:" size="s" bold className={s.title} />
                        <Text title={`${client?.phoneNumber}`} size="s" />
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="Социальные сети:" size="s" bold className={s.title} />
                        {client?.social ? (
                            <Link to={client.social} target="_blank">
                                Открыть
                            </Link>
                        ) : (
                            <Text title="-" size="s" />
                        )}
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="Статус:" size="s" bold className={s.title} />
                        {clientStatus ? (
                            <Text title={`${clientStatus}`} size="s" />
                        ) : (
                            <Text title="Не определен" size="s" />
                        )}
                    </HStack>
                    <HStack gap="32" align="start">
                        <Text title="Анамнез пациента:" size="s" bold className={s.title} />
                        {client?.anamnesis ? (
                            <Text title={`${client?.anamnesis}`} size="s" />
                        ) : (
                            <Text title="Не определен" size="s" />
                        )}
                    </HStack>
                    <HStack gap="32" align="start">
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
            <QuestionnaireBlock questionnaire={client?.questionnaire} image3d={client?.image_3d} />
        </Card>
    );
};

export const ClientDetails = memo((props: ClientDetailsProps) => {
    const { id, refreshVersion } = props;
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getClientDetailsIsLoading);
    const error = useSelector(getClientDetailsError);

    useEffect(() => {
        if (id) {
            dispatch(fetchClientById(id));
        }
    }, [dispatch, id, refreshVersion]);

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
