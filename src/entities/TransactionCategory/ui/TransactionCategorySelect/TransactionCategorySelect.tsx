import { classNames } from '@/shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './TransactionCategorySelect.module.scss';
import { memo, useCallback, useMemo } from 'react';
import { Select, SelectOption } from '@/shared/ui/Select/Select';
import { TransactionCategory } from '../../model/types/transactionCategory';

interface TransactionCategorySelectProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    /** Динамические опции из настроек; если не переданы — используется дефолтный enum */
    dynamicOptions?: { key: string; label: string }[];
}

const DEFAULT_OPTIONS: SelectOption<string>[] = Object.entries(TransactionCategory).map(([key, label]) => ({
    value: key,
    content: label,
}));

export const TransactionCategorySelect = memo((props: TransactionCategorySelectProps) => {
    const { className, onChange, value, dynamicOptions } = props;
    const { t } = useTranslation();

    const options: SelectOption<string>[] = useMemo(() => {
        if (dynamicOptions && dynamicOptions.length > 0) {
            return dynamicOptions.map(({ key, label }) => ({ value: key, content: label || key }));
        }
        return DEFAULT_OPTIONS;
    }, [dynamicOptions]);

    const onChangeHandler = useCallback(
        (val: string) => { onChange?.(val); },
        [onChange]
    );

    return (
        <Select
            className={classNames('', {}, [className])}
            label={t('Укажите категорию')}
            options={options}
            value={value}
            onChange={onChangeHandler}
            defaultValue="Выберите категорию"
        />
    );
});
