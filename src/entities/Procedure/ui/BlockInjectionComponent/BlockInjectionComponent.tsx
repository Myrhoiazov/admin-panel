import React, { memo, useCallback, useMemo } from 'react';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input';
import { Button } from 'shared/ui/Button';
import { Text } from 'shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';

interface BlockInjectionComponentProps {
    blocks: string[];
    onChangeInjectionBlocks?: (value: string[]) => void;
}

const BlockInjectionComponent = ({
    blocks,
    onChangeInjectionBlocks,
}: BlockInjectionComponentProps) => {
    const { t } = useTranslation();

    const handleAddZone = useCallback(() => {
        onChangeInjectionBlocks?.([...blocks, '']);
    }, [onChangeInjectionBlocks, blocks]);

    const handleZoneChange = useCallback(
        (index: number, value: string) => {
            const updated = [...blocks];
            updated[index] = value;
            onChangeInjectionBlocks?.(updated);
        },
        [onChangeInjectionBlocks, blocks]
    );

    const handleRemoveZone = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangeInjectionBlocks?.(updated);
        },
        [onChangeInjectionBlocks, blocks]
    );

    const renderBlock = useMemo(() => {
        return (item: string, index: number) => (
            <HStack key={index} gap="8" align="end" max>
                <Input
                    fullWidth
                    label={`Зона инъекции ${index + 1}`}
                    type="text"
                    value={item}
                    onChange={(value: string) => handleZoneChange(index, value)}
                />
                <Button onClick={() => handleRemoveZone(index)}>{t('Удалить')}</Button>
            </HStack>
        );
    }, [handleZoneChange, handleRemoveZone]);

    return (
        <VStack gap="16" max>
            <Text title="Зоны инъекций" size="m" />
            {blocks.map(renderBlock)}
            <Button onClick={handleAddZone}>{t('Добавить зону')}</Button>
        </VStack>
    );
};

export default memo(BlockInjectionComponent);
