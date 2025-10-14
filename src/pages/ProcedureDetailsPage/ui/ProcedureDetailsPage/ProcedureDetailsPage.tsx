import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureDetailsPage.module.scss';
import { useParams } from 'react-router-dom';
import { Page } from '@/widgets/Page/Page';
import { Text } from '@/shared/ui/Text/Text';
import { ProcedureDetails } from '@/entities/Procedure';
import { VStack } from '@/shared/ui/Stack';

interface ProcedureDetailsPageProps {
    className?: string;
}

const ProcedureDetailsPage = ({ className }: ProcedureDetailsPageProps) => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <Page className={classNames(s.ProcedureDetailsPage, {}, [className])}>
                <Text title="Procedure ID is missing" size="l" bold />
            </Page>
        );
    }

    return (
        <Page className={classNames(s.ProcedureDetailsPage, {}, [className])}>
            <VStack gap="24">
                <Text title={`Procedure Details for:`} size="l" bold />
                <ProcedureDetails id={id} />
            </VStack>
        </Page>
    );
};

export default memo(ProcedureDetailsPage);
