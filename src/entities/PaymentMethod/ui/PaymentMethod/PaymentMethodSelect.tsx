import { useTranslation } from 'react-i18next';
import { Select, SelectOption } from '@/shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { PaymentMethod } from '../../model/types/paymentMethod';
import { classNames } from '@/shared/lib/classNames/classNames';

interface PaymentMethodSelectProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    readonly?: boolean;
    /** Динамические опции из настроек; если не переданы — используется дефолтный enum */
    dynamicOptions?: { key: string; label: string }[];
}

const DEFAULT_OPTIONS: SelectOption<string>[] = Object.entries(PaymentMethod).map(([key, label]) => ({
    value: key,
    content: label,
}));

export const PaymentMethodSelect = memo(
    ({ className, value, onChange, readonly, dynamicOptions }: PaymentMethodSelectProps) => {
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
                label={t('Метод оплаты')}
                options={options}
                value={value}
                onChange={onChangeHandler}
                readonly={readonly}
                defaultValue="Выберите метод оплаты"
            />
        );
    }
);
