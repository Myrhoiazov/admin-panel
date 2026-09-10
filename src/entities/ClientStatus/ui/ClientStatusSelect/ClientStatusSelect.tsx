import { useTranslation } from 'react-i18next';
import { Select } from '@/shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { ClientStatusKey } from '../../model/types/status';
import { useClientStatusLabels } from '../../model/lib/useClientStatusLabels';
import { classNames } from '@/shared/lib/classNames/classNames';

interface ClientStatusSelectProps {
    className?: string;
    value?: ClientStatusKey;
    onChange?: (value: ClientStatusKey) => void;
    readonly?: boolean;
}

export const ClientStatusSelect = memo(
    ({ className, value, onChange, readonly }: ClientStatusSelectProps) => {
        const { t } = useTranslation();
        const labels = useClientStatusLabels();

        const options = useMemo(() => [
            { value: ClientStatusKey.BRONZE, content: labels.BRONZE },
            { value: ClientStatusKey.SILVER, content: labels.SILVER },
            { value: ClientStatusKey.GOLD, content: labels.GOLD },
            { value: ClientStatusKey.PLATINUM, content: labels.PLATINUM },
        ], [labels]);

        const onChangeHandler = useCallback(
            (value: string) => {
                onChange?.(value as ClientStatusKey);
            },
            [onChange]
        );

        const selectRole = useMemo(() => {
            return ClientStatusKey[value as unknown as keyof typeof ClientStatusKey];
        }, [value]);

        return (
            <Select
                className={classNames('', {}, [className])}
                label={t('Укажите статус')}
                options={options}
                value={selectRole}
                onChange={onChangeHandler}
                readonly={readonly}
            />
        );
    }
);
