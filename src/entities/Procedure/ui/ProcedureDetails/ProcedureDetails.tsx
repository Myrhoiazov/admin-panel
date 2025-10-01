import { memo } from 'react';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { HStack, VStack } from 'shared/ui/Stack';
import { fetchProcedureById } from '../../model/services/fetchProcedureById/fetchProcedureById';
import {
    getProcedureDetailsData,
    getProcedureDetailsError,
    getProcedureDetailsIsLoading,
} from '../../model/selectors/ProcedureDetails';
import { useSelector } from 'react-redux';
import { procedureDetailsReducer } from '../../model/slices/procedureDetailsSlice';
import { Text } from 'shared/ui/Text/Text';
import { AppImage } from 'shared/ui/AppImage';
import { Skeleton } from 'shared/ui/Skeleton/Skeleton';
import { Card } from 'shared/ui/Card/Card';
import s from './ProcedureDetails.module.scss';
import { renderProcedureBlock } from './renderBlock';

interface ProcedureDetailsProps {
    id?: string;
}

const reducers: ReducersList = {
    procedureDetails: procedureDetailsReducer,
};

const ProcedureElementSkeleton = () => {
    return (
        <Card className={s.card} padding="32" fullWidth>
            <HStack gap="32" max align="start">
                <VStack gap="16" max>
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width={300} height={32} />
                    <Skeleton width="100%" height={100} />
                </VStack>
                <Skeleton width={400} height={400} border="10%" />
            </HStack>
        </Card>
    );
};

const ProcedureElement = () => {
    const procedure = useSelector(getProcedureDetailsData);

    return (
        <Card className={s.card} padding="32" fullWidth>
            <HStack gap="32" max align="start">
                <VStack gap="16" max>
                    <Text title={procedure?.name} size="l" bold />
                    <Text text={procedure?.description} />
                    {Object.values(procedure?.blocks || {}).map(renderProcedureBlock)}
                </VStack>
                <span className={s.imageWrapper}>
                    <AppImage src={procedure?.images?.[0] as string} width={400} />
                </span>
            </HStack>
        </Card>
    );
};

export const ProcedureDetails = memo((props: ProcedureDetailsProps) => {
    const { id } = props;
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getProcedureDetailsIsLoading);
    const error = useSelector(getProcedureDetailsError);

    useInitialEffect(() => {
        if (id) {
            dispatch(fetchProcedureById(id));
        }
    });

    let content;

    if (isLoading) {
        content = <ProcedureElementSkeleton />;
    } else if (error) {
        content = <Text text="Процедура не найдена" align="center" />;
    } else {
        content = <ProcedureElement />;
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <VStack gap="16" max className={s.ProcedureDetails}>
                {content}
            </VStack>
        </DynamicModuleLoader>
    );
});
