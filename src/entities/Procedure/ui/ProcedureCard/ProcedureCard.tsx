import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import {
    Procedure,
    ProcedureBlockContraindication,
    ProcedureBlockInjection,
    ProcedureBlockPreparation,
    ProcedureBlockPrice,
    ProcedureBlockRehabilitation,
    ProcedureBlockResult,
    ProcedurePrice,
} from '../../model/types/procedure';
import BlockPriceComponent from '../BlockPriceComponent/BlockPriceComponent';
import { ProcedureBlockType } from '../../model/consts/procedureConsts';
import { VStack } from 'shared/ui/Stack';
import BlockPreparationComponent from '../BlockPreparationComponent/BlockPreparationComponent';
import BlockDescriptionComponent from '../BlockDescriptionComponent/BlockDescriptionComponent';
import BlockInjectionComponent from '../BlockInjectionComponent/BlockInjectionComponent';
import BlockRehabilitationComponent from '../BlockRehabilitationComponent/BlockRehabilitationComponent';
import BlockContraindicationComponent from '../BlockContraindicationComponent/BlockContraindicationComponent';
import BlockResultComponent from '../BlockResultComponent/BlockResultComponent';
import { Input } from 'shared/ui/Input/Input';
import { Text } from 'shared/ui/Text/Text';

export interface ProcedureCardProps {
    procedure?: Procedure;
    error?: string;
    isLoading?: boolean;
    onChangeTitle?: (value?: string) => void;
    onChangeDescription?: (value?: string) => void;
    onChangeFile?: (value?: File) => void;
    onChangePriceBlocks?: (value: ProcedurePrice[]) => void;
    onChangePreparationBlocks?: (value: string[]) => void;
    onChangeInjectionBlocks?: (value: string[]) => void;
    onChangeRehabilitationBlocks?: (value: string[]) => void;
    onChangeContraindicationBlocks?: (value: string[]) => void;
    onChangeResultBlocks?: (value: string[]) => void;
}

export const ProcedureCard = memo((props: ProcedureCardProps) => {
    const {
        procedure,
        onChangeTitle,
        onChangeDescription,
        onChangeFile,
        onChangePriceBlocks,
        onChangePreparationBlocks,
        onChangeInjectionBlocks,
        onChangeRehabilitationBlocks,
        onChangeContraindicationBlocks,
        onChangeResultBlocks,
    } = props;
    const { t } = useTranslation();

    const priceBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.PRICE] as ProcedureBlockPrice | undefined;
    }, [procedure?.blocks]);

    const preparationBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.PREPARATION] as
            | ProcedureBlockPreparation
            | undefined;
    }, [procedure?.blocks]);

    const injectionBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.INJECTION] as
            | ProcedureBlockInjection
            | undefined;
    }, [procedure?.blocks]);

    const rehabilitationBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.REHABILITATION] as
            | ProcedureBlockRehabilitation
            | undefined;
    }, [procedure?.blocks]);

    const resultBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.RESULT] as ProcedureBlockResult | undefined;
    }, [procedure?.blocks]);

    const contraindicationBlock = useMemo(() => {
        return procedure?.blocks?.[ProcedureBlockType.CONTRAINDICATION] as
            | ProcedureBlockContraindication
            | undefined;
    }, [procedure?.blocks]);

    return (
        <VStack gap="16" max>
            <BlockDescriptionComponent
                title={procedure?.name ?? ''}
                description={procedure?.description ?? ''}
                onChangeTitle={onChangeTitle}
                onChangeDescription={onChangeDescription}
            />

            <BlockInjectionComponent
                blocks={injectionBlock?.blocks || []}
                onChangeInjectionBlocks={onChangeInjectionBlocks}
            />
            <BlockPreparationComponent
                blocks={preparationBlock?.blocks ?? []}
                onChangePreparationBlocks={onChangePreparationBlocks}
            />
            <BlockResultComponent
                blocks={resultBlock?.blocks || []}
                onChangeResultBlocks={onChangeResultBlocks}
            />

            <BlockRehabilitationComponent
                blocks={rehabilitationBlock?.blocks || []}
                onChangeRehabilitationBlocks={onChangeRehabilitationBlocks}
            />

            <BlockContraindicationComponent
                blocks={contraindicationBlock?.blocks || []}
                onChangeContraindicationBlocks={onChangeContraindicationBlocks}
            />

            <BlockPriceComponent
                blocks={priceBlock?.blocks || []}
                readonly={false}
                onChangePriceBlocks={onChangePriceBlocks}
            />
            <VStack gap="8" max>
                <Text title="Загрузить файл" size="m" />
                <Input
                    fullWidth
                    type="file"
                    multiple
                    onChange={(file) => {
                        onChangeFile?.((file as File) || '');
                    }}
                />
            </VStack>
        </VStack>
    );
});
