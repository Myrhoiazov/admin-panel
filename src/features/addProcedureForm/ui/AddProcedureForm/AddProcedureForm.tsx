import { memo, useCallback, useState } from 'react';
import {
    ProcedureBlockInjection,
    ProcedureBlockPreparation,
    ProcedureBlockRehabilitation,
    ProcedureBlockContraindication,
    ProcedureBlockResult,
    ProcedureBlockPrice,
    ProcedureBlockType,
    ProcedureCard,
    ProcedurePrice,
} from 'entities/Procedure';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
    addProcedureFormActions,
    addProcedureFormReducer,
} from '../../model/slices/addProcedureFormSlice';
import {
    getProcedureFormData,
    getProcedureFormError,
    getProcedureFormIsLoading,
} from '../../model/selectors/procedureForm';
import { HStack } from 'shared/ui/Stack';
import { Button, ButtonTheme } from 'shared/ui/Button';
import { createProcedure } from '../../model/services/createProcedure';
import Loader from 'shared/ui/Loader/Loader';

interface AddProcedureFormProps {
    className?: string;
}

const reducers: ReducersList = {
    addProcedureForm: addProcedureFormReducer,
};

export const AddProcedureForm = memo((props: AddProcedureFormProps) => {
    const [file, setFile] = useState<File | null>(null);

    const dispatch = useAppDispatch();
    const isLoading = useSelector(getProcedureFormIsLoading);
    const procedure = useSelector(getProcedureFormData);
    const error = useSelector(getProcedureFormError);

    const onChangeTitle = useCallback(
        (value?: string) => {
            dispatch(addProcedureFormActions.createProcedure({ name: value ?? '' }));
        },
        [dispatch]
    );

    const onChangeDescription = useCallback(
        (value?: string) => {
            dispatch(addProcedureFormActions.createProcedure({ description: value ?? '' }));
        },
        [dispatch]
    );

    const onChangePriceBlocks = useCallback(
        (blocks: ProcedurePrice[]) => {
            const block: ProcedureBlockPrice = {
                type: ProcedureBlockType.PRICE,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.PRICE as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangePreparationBlocks = useCallback(
        (blocks: string[]) => {
            const block: ProcedureBlockPreparation = {
                type: ProcedureBlockType.PREPARATION,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.PREPARATION as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangeInjectionBlocks = useCallback(
        (blocks: string[]) => {
            const block: ProcedureBlockInjection = {
                type: ProcedureBlockType.INJECTION,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.INJECTION as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangeResultBlocks = useCallback(
        (blocks: string[]) => {
            const block: ProcedureBlockResult = {
                type: ProcedureBlockType.RESULT,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.RESULT as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangeRehabilitationBlocks = useCallback(
        (blocks: string[]) => {
            const block: ProcedureBlockRehabilitation = {
                type: ProcedureBlockType.REHABILITATION,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.REHABILITATION as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangeContraindicationBlocks = useCallback(
        (blocks: string[]) => {
            const block: ProcedureBlockContraindication = {
                type: ProcedureBlockType.CONTRAINDICATION,
                blocks,
            };
            dispatch(
                addProcedureFormActions.createProcedure({
                    blocks: {
                        [ProcedureBlockType.CONTRAINDICATION as string]: block,
                    },
                })
            );
        },
        [dispatch]
    );

    const onChangeFile = useCallback(
        (image?: File | string) => {
            if (image instanceof File) {
                setFile(image);
            }
        },
        [dispatch]
    );

    const onCancelEdit = useCallback(() => {
        dispatch(addProcedureFormActions.cancelEdit());
    }, [dispatch]);

    const onSave = useCallback(async () => {
        const result = await dispatch(createProcedure({ file }));
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(addProcedureFormActions.cancelEdit());
        }
    }, [dispatch, file]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <HStack gap="16" align="center" justify="end">
                <Button
                    type="button"
                    onClick={onCancelEdit}
                    disabled={!procedure || isLoading}
                    theme={!procedure ? ButtonTheme.OUTLINE : ButtonTheme.OUTLINE_RED}
                >
                    Отменить
                </Button>
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={!procedure || isLoading}
                    theme={ButtonTheme.BACKGROUND_INVERTED}
                >
                    Сохранить
                </Button>
            </HStack>
            <ProcedureCard
                onChangeTitle={onChangeTitle}
                onChangePriceBlocks={onChangePriceBlocks}
                onChangeDescription={onChangeDescription}
                onChangePreparationBlocks={onChangePreparationBlocks}
                onChangeInjectionBlocks={onChangeInjectionBlocks}
                onChangeRehabilitationBlocks={onChangeRehabilitationBlocks}
                onChangeContraindicationBlocks={onChangeContraindicationBlocks}
                onChangeResultBlocks={onChangeResultBlocks}
                onChangeFile={onChangeFile}
                procedure={procedure}
                isLoading={isLoading}
                error={error}
            />
        </DynamicModuleLoader>
    );
});
