import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input/Input';
import { HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import Textarea from '@/shared/ui/Textarea/Textarea';

interface BlockPreparationComponentProps {
    blocks: string[];
    onChangePreparationBlocks?: (value: string[]) => void;
}

const BlockPreparationComponent = (props: BlockPreparationComponentProps) => {
    const { blocks, onChangePreparationBlocks } = props;
    const { t } = useTranslation();

    const handleAddBlock = useCallback(() => {
        onChangePreparationBlocks?.([...blocks, '']);
    }, [onChangePreparationBlocks, blocks]);

    const handleBlockChange = useCallback(
        (index: number, value: string) => {
            const updated = [...blocks];
            updated[index] = value;
            onChangePreparationBlocks?.(updated);
        },
        [onChangePreparationBlocks, blocks]
    );

    const handleRemoveBlock = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangePreparationBlocks?.(updated);
        },
        [onChangePreparationBlocks, blocks]
    );

    const renderBlock = useMemo(() => {
        return (item: string, index: number) => (
            <HStack key={index} gap="8" align="end" max>
                <Input
                    fullWidth
                    label={`Блок подготовки ${index + 1}`}
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
            <Text title="Подготовка к процедуре" size="m" />
            {blocks.map(renderBlock)}
            <Button theme={ButtonTheme.OUTLINE} onClick={handleAddBlock}>{t('Добавить зону')}</Button>
        </>
    );
};

export default memo(BlockPreparationComponent);
