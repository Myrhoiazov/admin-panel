import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { memo, useCallback, useEffect, useState } from 'react';
import {
    addTransactionFormActions,
    addTransactionFormReducer,
} from '../../model/slices/addTransactionFormSlice';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { TransactionCard } from '@/entities/Transaction';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getTransactionFormData } from '../../model/selectors/getTransactionFormData';
import { TransactionType } from '@/entities/TransactionType';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { createTransaction } from '../../model/services/createTransaction/createTransaction';
import { PaymentMethod } from '@/entities/PaymentMethod';
import { TransactionCategory } from '@/entities/TransactionCategory';
import { $apiPrivate } from '@/shared/api/api';

interface AddTransactionFormProps {
    className?: string;
    onSuccess: () => void;
    reloadPage?: () => void;
}

const initialReducers: ReducersList = {
    addTransactionForm: addTransactionFormReducer,
};

const DEFAULT_PM_OPTIONS = Object.entries(PaymentMethod).map(([key, label]) => ({ key, label }));
const DEFAULT_CAT_OPTIONS = Object.entries(TransactionCategory).map(([key, label]) => ({ key, label }));

const AddTransactionForm = memo((props: AddTransactionFormProps) => {
    const { className, onSuccess, reloadPage } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const formData = useSelector(getTransactionFormData);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState<{ key: string; label: string }[]>(DEFAULT_PM_OPTIONS);
    const [categoryOptions, setCategoryOptions] = useState<{ key: string; label: string }[]>(DEFAULT_CAT_OPTIONS);

    useEffect(() => {
        $apiPrivate
            .get<{
                paymentMethodLabels?: Record<string, string>;
                expenseCategoryLabels?: Record<string, string>;
            }>('/company-settings')
            .then(({ data }) => {
                if (data.paymentMethodLabels && Object.keys(data.paymentMethodLabels).length > 0) {
                    setPaymentMethodOptions(
                        Object.entries(data.paymentMethodLabels).map(([key, label]) => ({ key, label: label || key }))
                    );
                }
                if (data.expenseCategoryLabels && Object.keys(data.expenseCategoryLabels).length > 0) {
                    setCategoryOptions(
                        Object.entries(data.expenseCategoryLabels).map(([key, label]) => ({ key, label: label || key }))
                    );
                }
            })
            .catch(() => { /* fallback to defaults */ });
    }, []);

    const onChangeTransactionType = useCallback(
        (type: TransactionType) => {
            dispatch(
                addTransactionFormActions.updateForm({ type: type || TransactionType.INCOME })
            );
        },
        [dispatch]
    );
    const onChangeTransactionCategory = useCallback(
        (value: string) => {
            dispatch(addTransactionFormActions.updateForm({ category: value as TransactionCategory }));
        },
        [dispatch]
    );
    const onChangePaymentMethod = useCallback(
        (value: string) => {
            dispatch(
                addTransactionFormActions.updateForm({
                    paymentMethod: (value || 'CASH') as PaymentMethod,
                })
            );
        },
        [dispatch]
    );
    const onChangeSum = useCallback(
        (value?: string) => {
            dispatch(addTransactionFormActions.updateForm({ amount: value ?? '0' }));
        },
        [dispatch]
    );
    const onChangeDescription = useCallback(
        (value?: string) => {
            dispatch(addTransactionFormActions.updateForm({ description: value ?? '' }));
        },
        [dispatch]
    );
    const onChangeDate = useCallback(
        (value?: string) => {
            dispatch(addTransactionFormActions.updateForm({ date: value ?? '' }));
        },
        [dispatch]
    );

    const onSave = useCallback(async () => {
        const result = await dispatch(createTransaction());
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            reloadPage?.();
        }
    }, [onSuccess, dispatch, reloadPage]);

    return (
        <DynamicModuleLoader reducers={initialReducers}>
            <div className={classNames('', {}, [className])}>
                <VStack gap="24" align="center">
                    <Text size="m" title={t('Добавление прихода - расхода')} bold />
                    <TransactionCard
                        data={formData}
                        onChangeTransactionType={onChangeTransactionType}
                        onChangeSum={onChangeSum}
                        onChangeDescription={onChangeDescription}
                        onChangeDate={onChangeDate}
                        onChangePaymentMethod={onChangePaymentMethod}
                        onChangeTransactionCategory={onChangeTransactionCategory}
                        paymentMethodOptions={paymentMethodOptions}
                        categoryOptions={categoryOptions}
                    />
                    <Button fullWidth onClick={onSave} theme={ButtonTheme.BACKGROUND_INVERTED}>
                        {t('Добавить')}
                    </Button>
                </VStack>
            </div>
        </DynamicModuleLoader>
    );
});

export default AddTransactionForm;
