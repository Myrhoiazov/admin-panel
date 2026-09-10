import { ProcedureBlock, ProcedureBlockPrice } from '../../model/types/procedure';
import { ProcedureBlockType } from '../../model/consts/procedureConsts';
import { HStack, VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { useMemo } from 'react';

export const renderProcedureBlock = (block: ProcedureBlock) => {
    switch (block.type) {
        case ProcedureBlockType.PREPARATION:
            return (
                <VStack key={ProcedureBlockType.PREPARATION}>
                    <Text title="Подготовка" bold />
                    <Text text={`${block.blocks?.join(', ')} ` || 'Нет данных'} />
                </VStack>
            );
        case ProcedureBlockType.CONTRAINDICATION:
            return (
                <VStack key={ProcedureBlockType.CONTRAINDICATION}>
                    <Text title="Противопоказания" bold />
                    <Text text={`${block.blocks?.join(', ')} ` || 'Нет данных'} />
                </VStack>
            );
        case ProcedureBlockType.INJECTION:
            return (
                <VStack key={ProcedureBlockType.INJECTION}>
                    <Text title="Зоны инъекций" bold />
                    <Text text={`${block.blocks?.join(', ')} ` || 'Нет данных'} />
                </VStack>
            );
        case ProcedureBlockType.REHABILITATION:
            return (
                <VStack key={ProcedureBlockType.REHABILITATION}>
                    <Text title="Реабилитация" bold />
                    <Text text={`${block.blocks?.join(', ')} ` || 'Нет данных'} />
                </VStack>
            );
        case ProcedureBlockType.RESULT:
            return (
                <VStack key={ProcedureBlockType.RESULT}>
                    <Text title="Результат" bold />
                    <Text text={`${block.blocks?.join(', ')}` || 'Нет данных'} />
                </VStack>
            );
        case ProcedureBlockType.PRICE:
            return (
                <VStack gap="8" key={ProcedureBlockType.PRICE}>
                    <Text title="Прайс" bold />
                    {block.blocks?.length ? (
                        block?.blocks?.map((item) => (
                            <HStack gap="48" justify="between" max key={item.zone}>
                                <Text text={`${item.zone}:`} />
                                <Text text={`${item.price}₴`} />
                            </HStack>
                        ))
                    ) : (
                        <Text text="Нет данных" />
                    )}
                </VStack>
            );

        default:
            return null;
    }
};
