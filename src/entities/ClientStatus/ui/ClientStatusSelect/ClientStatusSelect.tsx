import { useTranslation } from 'react-i18next';
import { Select } from 'shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { ClientStatus } from '../../model/types/status';
import { classNames } from 'shared/lib/classNames/classNames';

interface ClientStatusSelectProps {
    className?: string;
    value?: ClientStatus;
    onChange?: (value: ClientStatus) => void;
    readonly?: boolean;
}

const options = [
    { value: ClientStatus.BRONZE, content: ClientStatus.BRONZE },
    { value: ClientStatus.GOLD, content: ClientStatus.GOLD },
    { value: ClientStatus.PLATINUM, content: ClientStatus.PLATINUM },
    { value: ClientStatus.SILVER, content: ClientStatus.SILVER },
];

export const ClientStatusSelect = memo(
    ({ className, value, onChange, readonly }: ClientStatusSelectProps) => {
        const { t } = useTranslation();

        const onChangeHandler = useCallback(
            (value: string) => {
                onChange?.(value as ClientStatus);
            },
            [onChange]
        );

        const selectRole = useMemo(() => {
            return ClientStatus[value as unknown as keyof typeof ClientStatus];
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
