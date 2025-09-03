import React, { memo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ProcedureEditPage.module.scss';
import { Page } from 'widgets/Page/Page';
import { useParams } from 'react-router-dom';

interface ProcedureEditPageProps {
    className?: string;
}

const ProcedureEditPage = ({ className }: ProcedureEditPageProps) => {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    return (
        <Page className={classNames(s.ProceduresEditPage, {}, [className])}>
            {isEdit ? 'Редактирование статьи с ID = ' + { id } : 'Создание новой статьи'}
        </Page>
    );
};

export default memo(ProcedureEditPage);
