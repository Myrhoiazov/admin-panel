import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Summary.module.scss';
import { memo } from 'react';
import { Summary } from '../../model/types/summary';
import { HStack } from '@/shared/ui/Stack';
import { Card } from '@/shared/ui/Card/Card';
import { Text } from '@/shared/ui/Text/Text';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';

interface SummaryCardsProps {
    className?: string;
    summary?: Summary;
    isLoading?: boolean;
}

export const SummaryCards = memo((props: SummaryCardsProps) => {
    const { className, summary, isLoading } = props;

    if (isLoading) {
        return (
            <div className={classNames(cls.Summary, {}, [className])}>
                <HStack justify="between" align="center" gap="16" max>
                    <Skeleton width={600} height={120} border="12px" />
                    <Skeleton width={600} height={120} border="12px" />
                    <Skeleton width={600} height={120} border="12px" />
                </HStack>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className={classNames(cls.Summary, {}, [])}>
                <Text size="l" title="Клиенты не найдены" className={cls.title} />
            </div>
        );
    }

    return (
        <div className={classNames(cls.Summary, {}, [className])}>
            <HStack justify="between" align="center" gap="16">
                <Card className={cls.card} padding="16">
                    <HStack justify="between">
                        <Text className={cls.title} title="Приход" />
                        <Text className={cls.title} title={`${String(summary?.income)}uah`} />
                    </HStack>
                </Card>
                <Card className={cls.card} padding="16">
                    <HStack justify="between">
                        <Text className={cls.title} title="Расход" />
                        <Text className={cls.title} title={`${String(summary?.expense)}uah`} />
                    </HStack>
                </Card>
                <Card className={cls.card} padding="16">
                    <HStack justify="between">
                        <Text className={cls.title} title="Баланс" />
                        <Text className={cls.title} title={`${String(summary?.balance)}uah`} />
                    </HStack>
                </Card>
            </HStack>
        </div>
    );
});
