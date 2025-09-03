import React, { memo } from 'react';
import { Page } from 'widgets/Page/Page';
import { VStack } from 'shared/ui/Stack';
import { AddProcedureForm } from 'features/addProcedureForm';
import { Card } from 'shared/ui/Card/Card';
import ProcedureCreatePageHeader from '../ProcedureCreatePageHeader/ProcedureCreatePageHeader';

const ProcedureCreatePage = () => {
    return (
        <Page>
            <VStack gap="48">
                <ProcedureCreatePageHeader />
                <Card fullWidth shadow="shadowLight" padding="48">
                    <AddProcedureForm />
                </Card>
            </VStack>
        </Page>
    );
};

export default memo(ProcedureCreatePage);
