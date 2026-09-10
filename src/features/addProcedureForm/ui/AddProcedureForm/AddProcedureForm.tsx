import { memo, useCallback, useEffect, useState } from 'react';
import {
    ProcedureBlockInjection,
    ProcedureBlockPreparation,
    ProcedureBlockRehabilitation,
    ProcedureBlockContraindication,
    ProcedureBlockResult,
    ProcedureBlockPrice,
    ProcedureBlockType,
    ProcedureCard,
    Procedure,
    ProcedurePrice,
} from '@/entities/Procedure';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
    addProcedureFormActions,
    addProcedureFormReducer,
} from '../../model/slices/addProcedureFormSlice';
import {
    getProcedureFormData,
    getProcedureFormError,
    getProcedureFormIsLoading,
} from '../../model/selectors/procedureForm';
import { HStack } from '@/shared/ui/Stack';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { createProcedure } from '../../model/services/createProcedure';
import { updateProcedure } from '../../model/services/updateProcedure';
import Loader from '@/shared/ui/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { $apiPrivate } from '@/shared/api/api';
import cls from './AddProcedureForm.module.scss';

interface AddProcedureFormProps {
    className?: string;
    procedureId?: string;
    isEditMode?: boolean;
    onSaved?: (procedureId?: string) => void;
}

const reducers: ReducersList = {
    addProcedureForm: addProcedureFormReducer,
};

export const AddProcedureForm = memo((props: AddProcedureFormProps) => {
    const { procedureId, isEditMode, onSaved } = props;
    const [file, setFile] = useState<File | null>(null);
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const isLoading = useSelector(getProcedureFormIsLoading);
    const procedure = useSelector(getProcedureFormData);
    const error = useSelector(getProcedureFormError);

    useEffect(() => {
        let isMounted = true;
        const loadProcedure = async () => {
            if (!isEditMode || !procedureId) {
                return;
            }
            try {
                const { data } = await $apiPrivate.get<Procedure>(`/procedures/${procedureId}`);
                if (isMounted && data) {
                    dispatch(addProcedureFormActions.createProcedure(data));
                }
            } catch (e) {
                //
            }
        };
        loadProcedure();
        return () => {
            isMounted = false;
        };
    }, [dispatch, isEditMode, procedureId]);

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

    const onChangeBasePrice = useCallback(
        (value?: string) => {
            dispatch(addProcedureFormActions.createProcedure({ basePrice: Number(value || 0) }));
        },
        [dispatch]
    );

    const onChangeDefaultDurationMin = useCallback(
        (value?: string) => {
            dispatch(addProcedureFormActions.createProcedure({ defaultDurationMin: Number(value || 60) }));
        },
        [dispatch]
    );

    const onChangeDurationType = useCallback(
        (value?: 'MINUTES_20' | 'MINUTES_40' | 'MINUTES_60' | 'MINUTES_120' | 'FLEXIBLE') => {
            dispatch(addProcedureFormActions.createProcedure({ durationType: value || 'MINUTES_60' }));
            dispatch(addProcedureFormActions.createProcedure({ isFlexibleDuration: value === 'FLEXIBLE' }));
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

    const onChangeImage = useCallback((file?: File) => {
        if (file) {
            setFile(file);
        }
    }, []);

    const onCancelEdit = useCallback(() => {
        dispatch(addProcedureFormActions.cancelEdit());
    }, [dispatch]);

    const onSave = useCallback(async () => {
        const result = isEditMode && procedureId
            ? await dispatch(updateProcedure({ id: procedureId, file }))
            : await dispatch(createProcedure({ file }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success(isEditMode ? t('Процедура успешно обновлена') : t('Процедура успешно добавленна'));
            if (!isEditMode) {
                dispatch(addProcedureFormActions.cancelEdit());
            }
            onSaved?.((result.payload as Procedure)?.id);
        }
    }, [dispatch, file, isEditMode, onSaved, procedureId, t]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.AddProcedureForm}>
                <HStack gap="16" align="center" justify="end" className={cls.actions}>
                <Button
                    type="button"
                    onClick={onCancelEdit}
                    disabled={!procedure || isLoading}
                    theme={!procedure ? ButtonTheme.OUTLINE : ButtonTheme.OUTLINE_RED}
                    className={cls.cancelBtn}
                >
                    {t('Отменить')}
                </Button>
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={!procedure || isLoading}
                    theme={ButtonTheme.BACKGROUND}
                    className={cls.saveBtn}
                >
                    {t('Сохранить')}
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
                    onChangeFile={onChangeImage}
                    onChangeBasePrice={onChangeBasePrice}
                    onChangeDefaultDurationMin={onChangeDefaultDurationMin}
                    onChangeDurationType={onChangeDurationType}
                    procedure={procedure}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </DynamicModuleLoader>
    );
});
