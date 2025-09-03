import React, { memo, use, useCallback, useMemo } from 'react';
import { Input } from 'shared/ui/Input/Input';
import { ProcedurePrice } from 'entities/Procedure/model/types/procedure';
import { HStack, VStack } from 'shared/ui/Stack';
import { Button } from 'shared/ui/Button';
import { Text } from 'shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';

interface BlockPriceComponentProps {
    blocks: ProcedurePrice[];
    readonly?: boolean;
    onChangePriceBlocks?: (blocks: ProcedurePrice[]) => void;
}

const BlockPriceComponent = (props: BlockPriceComponentProps) => {
    const { blocks, readonly, onChangePriceBlocks } = props;
    const { t } = useTranslation();

    const handlePriceChange = useCallback(
        (index: number, field: keyof ProcedurePrice, value: string) => {
            const updated = blocks.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            onChangePriceBlocks?.(updated);
        },
        [onChangePriceBlocks, blocks]
    );

    const handleAdd = useCallback(() => {
        onChangePriceBlocks?.([...blocks, { zone: '', price: '' }]);
    }, [onChangePriceBlocks, blocks]);

    const handleRemove = useCallback(
        (index: number) => {
            const updated = blocks.filter((_, i) => i !== index);
            onChangePriceBlocks?.(updated);
        },
        [onChangePriceBlocks, blocks]
    );

    const priceBlock = useMemo(() => {
        return (item: ProcedurePrice, index: number) => (
            <HStack key={item.zone} gap="24" align="end" max>
                <Input
                    fullWidth
                    label="Зона услуги"
                    value={item.zone}
                    onChange={(value: string) => handlePriceChange(index, 'zone', value)}
                />
                <Input
                    label="Цена"
                    fullWidth
                    value={item.price}
                    onChange={(value: string) => handlePriceChange(index, 'price', value)}
                />
                <Button type="button" onClick={() => handleRemove(index)}>
                    {t('удалить')}
                </Button>
            </HStack>
        );
    }, [handlePriceChange, handleRemove]);

    return (
        <VStack gap="16" max>
            <Text title="Цены на услуги" size="m" />
            {blocks.map(priceBlock)}

            <Button type="button" onClick={handleAdd}>
                {t(' + Добавить цену')}
            </Button>
        </VStack>
    );
};

export default memo(BlockPriceComponent);
