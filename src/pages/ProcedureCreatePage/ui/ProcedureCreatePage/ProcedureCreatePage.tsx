import React, { memo } from 'react';
import { Page } from '@/widgets/Page/Page';
import { VStack } from '@/shared/ui/Stack';
import { AddProcedureForm } from '@/features/addProcedureForm';
import { Card } from '@/shared/ui/Card/Card';
import ProcedureCreatePageHeader from '../ProcedureCreatePageHeader/ProcedureCreatePageHeader';
import cls from './ProcedureCreatePage.module.scss';

const ProcedureCreatePage = () => {
    return (
        <Page className={cls.ProcedureCreatePage}>
            <VStack gap="24">
                <ProcedureCreatePageHeader />
                <Card className={cls.formCard} fullWidth shadow="shadowLight" padding="32">
                    <AddProcedureForm />
                </Card>
            </VStack>
        </Page>
    );
};

export default memo(ProcedureCreatePage);
