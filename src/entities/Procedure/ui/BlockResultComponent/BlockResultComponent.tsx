import React, { memo, useCallback, useMemo } from 'react';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input';
import { Button } from 'shared/ui/Button';
import { Text } from 'shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';

interface BlockResultComponentProps {
    blocks: string[];
    onChangeResultBlocks?: (value: string[]) => void;
}

const BlockResultComponent = ({ blocks, onChangeResultBlocks }: BlockResultComponentProps) => {
    const { t } = useTranslation();
    const handleAddZone = useCallback(() => {
        onChangeResultBlocks?.([...blocks, '']);
    }, [onChangeResultBlocks, blocks]);

    const handleZoneChange = useCallback(
        (index: number, value: string) => {
            const updated = [...blocks];
            updated[index] = value;
            onChangeResultBlocks?.(updated);
        },
        [onChangeResultBlocks, blocks]
    );

    const handleRemoveZone = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangeResultBlocks?.(updated);
        },
        [onChangeResultBlocks, blocks]
    );

    const renderBlock = useMemo(() => {
        return (item: string, index: number) => (
            <HStack key={index} gap="8" align="end" max>
                <Input
                    fullWidth
                    label={`Блок результата ${index + 1}`}
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
            <Text title="Результат" size="m" />
            {blocks.map(renderBlock)}
            <Button onClick={handleAddZone}>{t('Добавить зону')}</Button>
        </VStack>
    );
};

export default memo(BlockResultComponent);
