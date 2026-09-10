import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input/Input';
import { HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';

interface BlockRehabilitationProps {
    blocks: string[];
    onChangeRehabilitationBlocks?: (value: string[]) => void;
}

const BlockRehabilitationComponent = (props: BlockRehabilitationProps) => {
    const { blocks, onChangeRehabilitationBlocks } = props;
    const { t } = useTranslation();

    const handleAddBlock = useCallback(() => {
        onChangeRehabilitationBlocks?.([...blocks, '']);
    }, [onChangeRehabilitationBlocks, blocks]);

    const handleBlockChange = useCallback(
        (index: number, value: string) => {
            const updated = [...blocks];
            updated[index] = value;
            onChangeRehabilitationBlocks?.(updated);
        },
        [onChangeRehabilitationBlocks, blocks]
    );

    const handleRemoveBlock = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangeRehabilitationBlocks?.(updated);
        },
        [onChangeRehabilitationBlocks, blocks]
    );

    const renderBlock = useMemo(() => {
        return (item: string, index: number) => (
            <HStack key={index} gap="8" align="end" max>
                <Input
                    fullWidth
                    label={`Блок реабилитации ${index + 1}`}
                    type="text"
                    value={item}
                    onChange={(value: string) => handleBlockChange(index, value)}
                />
                <Button theme={ButtonTheme.OUTLINE_RED} onClick={() => handleRemoveBlock(index)}>{t('Удалить')}</Button>
            </HStack>
        );
    }, [handleBlockChange, handleRemoveBlock]);

    return (
        <>
            <Text title="Реабилитация" size="m" />
            {blocks.map(renderBlock)}
            <Button theme={ButtonTheme.OUTLINE} onClick={handleAddBlock}>{t('Добавить зону')}</Button>
        </>
    );
};

export default memo(BlockRehabilitationComponent);
