import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input/Input';
import { HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';

interface BlockContraindicationProps {
    blocks: string[];
    onChangeContraindicationBlocks?: (value: string[]) => void;
}

const BlockContraindicationComponent = (props: BlockContraindicationProps) => {
    const { blocks, onChangeContraindicationBlocks } = props;
    const { t } = useTranslation();

    const handleAddBlock = useCallback(() => {
        onChangeContraindicationBlocks?.([...blocks, '']);
    }, [onChangeContraindicationBlocks, blocks]);

    const handleBlockChange = useCallback(
        (index: number, value: string) => {
            const updated = [...blocks];
            updated[index] = value;
            onChangeContraindicationBlocks?.(updated);
        },
        [blocks, onChangeContraindicationBlocks]
    );

    const handleRemoveBlock = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangeContraindicationBlocks?.(updated);
        },
        [blocks, onChangeContraindicationBlocks]
    );

    const renderBlock = useMemo(() => {
        return (item: string, index: number) => (
            <HStack key={item} gap="8" align="end" max>
                <Input
                    fullWidth
                    label={`Блок противопоказаний ${index + 1}`}
                    type="text"
                    value={item}
                    onChange={(value: string) => handleBlockChange(index, value)}
                />
                <Button onClick={() => handleRemoveBlock(index)}>{t('Удалить')}</Button>
            </HStack>
        );
    }, [handleBlockChange, handleRemoveBlock]);

    return (
        <>
            <Text title="Противопоказание" size="m" />
            {blocks.map(renderBlock)}
            <Button onClick={handleAddBlock}>{t('Добавить зону')}</Button>
        </>
    );
};

export default memo(BlockContraindicationComponent);
