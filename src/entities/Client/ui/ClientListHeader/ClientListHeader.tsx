import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ClientListHeader.module.scss';
import { Card } from '@/shared/ui/Card/Card';
import { useTranslation } from 'react-i18next';

interface ClientListHeaderProps {
    className?: string;
}

const ClientListHeader = ({ className }: ClientListHeaderProps) => {
    const { t } = useTranslation();

    return (
        <Card
            padding="16"
            fullWidth
            className={classNames(s.ClientTableListHeader, {}, [className])}
        >
            <div className={s.grid}>
                <p>#</p>
                <p>{t('Дата')}</p>
                <p>{t('Имя Фамилия')}</p>
                <p>{t('Имеил')}</p>
                <p>{t('Статус')}</p>
                <p className={s.actionsCol}>{t('Действия')}</p>
            </div>
        </Card>
    );
};

export default memo(ClientListHeader);
