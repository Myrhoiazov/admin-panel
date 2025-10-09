import React, { memo, useCallback } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './AppoimentDetails.module.scss';
import { Appointment, AppointmentImage } from '../../model/types/appoiment';
import { useTranslation } from 'react-i18next';
import { Text } from 'shared/ui/Text/Text';
import { Card } from 'shared/ui/Card/Card';
import { HStack, VStack } from 'shared/ui/Stack';
import { Skeleton } from 'shared/ui/Skeleton/Skeleton';
import { AppImage } from 'shared/ui/AppImage';

interface AppoimentDetailsProps {
    className?: string;
    appoiment?: Appointment;
    error?: string;
    isLoading?: boolean;
}

interface AppoimentElementProps {
    appoiment: Appointment;
}

const AppoimentDetailsSkeleton = () => {
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

const AppoimentElement = ({ appoiment }: AppoimentElementProps) => {
    const { t } = useTranslation();

    const currentDate = appoiment?.createdAt ? new Date(appoiment?.createdAt) : '';
    let formatted;

    if (currentDate) {
        formatted = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(currentDate);
    }

    const getImageUrl = useCallback((image: AppointmentImage) => {
        return image instanceof File ? URL.createObjectURL(image) : image.url;
    }, []);

    return (
        <Card padding="32" fullWidth>
            {formatted && (
                <HStack max justify="end">
                    {formatted}
                </HStack>
            )}
            <HStack gap="32" max align="start" justify="between">
                <VStack gap="16" max>
                    <HStack gap="16">
                        <Text text="Клиент:" />
                        <Text title={t(appoiment?.client?.firstName || '')} />
                    </HStack>
                    <HStack gap="16">
                        <Text text="Доктор:" />
                        <Text title={t(appoiment?.doctor?.firstName || '')} />
                    </HStack>
                    <HStack gap="16">
                        <Text text="Процедура:" />
                        <Text title={t(appoiment?.procedure?.name || '')} />
                    </HStack>
                    <HStack gap="16" max>
                        {appoiment.images?.map((img, index) => (
                            <span key={index} className={s.imageWrap}>
                                <AppImage
                                    src={getImageUrl(img)}
                                    width={300}
                                    className={s.image}
                                    alt={`appointment-image-${index}`}
                                />
                            </span>
                        ))}
                    </HStack>
                    <VStack gap="16">
                        <Text title="Описание:" size="s" />
                        <Text text={t(appoiment?.note || '')} />
                    </VStack>
                </VStack>
            </HStack>
        </Card>
    );
};

export const AppoimentDetails = memo((props: AppoimentDetailsProps) => {
    const { t } = useTranslation();
    const { className, appoiment, isLoading, error } = props;

    let content;

    if (isLoading) {
        content = <AppoimentDetailsSkeleton />;
    } else if (error || !appoiment) {
        content = <Text title="Клиента не существует" align="center" />;
    } else {
        content = <AppoimentElement appoiment={appoiment} />;
    }

    return <div className={classNames(s.AppoimentDetails, {}, [className])}>{content}</div>;
});
