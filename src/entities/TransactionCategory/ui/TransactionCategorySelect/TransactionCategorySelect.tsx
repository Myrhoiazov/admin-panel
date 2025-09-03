import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './TransactionCategorySelect.module.scss';
import { memo, useCallback } from 'react';
import { Select } from 'shared/ui/Select/Select';
import { TransactionCategory } from '../../model/types/transactionCategory';

interface TransactionCategorySelectProps {
    className?: string;
    value?: TransactionCategory;
    onChange?: (value: TransactionCategory) => void;
}

const options = [
    { value: TransactionCategory.COSMETICS, content: TransactionCategory.COSMETICS },
    { value: TransactionCategory.COSMOLOOK, content: TransactionCategory.COSMOLOOK },
    { value: TransactionCategory.EMET, content: TransactionCategory.EMET },
    { value: TransactionCategory.MERZ, content: TransactionCategory.MERZ },
    { value: TransactionCategory.PHARMACY, content: TransactionCategory.PHARMACY },
    { value: TransactionCategory.TOTIS, content: TransactionCategory.TOTIS },
    { value: TransactionCategory.OTHER, content: TransactionCategory.OTHER },
];

export const TransactionCategorySelect = memo((props: TransactionCategorySelectProps) => {
    const { className, onChange, value } = props;
    const { t } = useTranslation();

    const onChangeHandler = useCallback(
        (value: TransactionCategory) => {
            onChange?.(value);
        },
        [onChange]
    );

    return (
        <Select
            className={classNames('', {}, [className])}
            label={t('Укажите категорию')}
            options={options}
            value={value}
            onChange={onChangeHandler}
        />
    );
});
