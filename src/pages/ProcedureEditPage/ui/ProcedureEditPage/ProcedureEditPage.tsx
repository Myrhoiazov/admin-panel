import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureEditPage.module.scss';
import { Page } from '@/widgets/Page/Page';
import { useNavigate, useParams } from 'react-router-dom';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { Card } from '@/shared/ui/Card/Card';
import { AddProcedureForm } from '@/features/addProcedureForm';
import { getRouteProcedureDetails } from '@/shared/const/router';

interface ProcedureEditPageProps {
    className?: string;
}

const ProcedureEditPage = ({ className }: ProcedureEditPageProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        return (
            <Page className={classNames(s.ProceduresEditPage, {}, [className])}>
                <Text title="Не выбран ID процедуры" size="l" bold />
            </Page>
        );
    }

    return (
        <Page className={classNames(s.ProceduresEditPage, {}, [className])}>
            <VStack gap="24">
                <Text title="Редактирование процедуры" size="l" bold />
                <Card className={s.formCard} fullWidth shadow="shadowLight" padding="32">
                    <AddProcedureForm
                        isEditMode
                        procedureId={id}
                        onSaved={() => navigate(getRouteProcedureDetails(id))}
                    />
                </Card>
            </VStack>
        </Page>
    );
};

export default memo(ProcedureEditPage);
