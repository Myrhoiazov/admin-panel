import React, { memo } from 'react';

import { HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';

interface ProcedureCreatePageHeaderProps {
    file?: File | null;
}

const ProcedureCreatePageHeader = ({ file }: ProcedureCreatePageHeaderProps) => {
    return (
        <HStack justify="between" align="center" max>
            <Text title="Создание процедуры" size="l" bold />
        </HStack>
    );
};

export default memo(ProcedureCreatePageHeader);
