import { useTranslation } from 'react-i18next';
import { Select } from 'shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { Procedure } from 'entities/Procedure';
import { Client } from 'entities/Client';

interface ClientSelectProps {
    className?: string;
    onChange?: (value: Client) => void;
    options?: Client[];
    value?: Client;
}

export const ClientSelect = memo((props: ClientSelectProps) => {
    const { className, value, onChange, options } = props;
    const { t } = useTranslation();

    const selectOptions = options?.map((client) => {
        const fullName = `${client.firstName} ${client.lastName}`;
        return {
            value: String(client.id),
            content: fullName ?? '',
        };
    });

    const onChangeHandler = useCallback(
        (id: string) => {
            const client = options?.find((p) => String(p.id) === id);
            onChange?.(client as Client);
        },
        [onChange, options]
    );

    const selectClient = useMemo(() => {
        return options?.find((p) => String(p.id) === String(value?.id));
    }, [value, options]);

    return (
        <Select
            defaultValue={t('Выберите клиента')}
            className={classNames('', {}, [className])}
            label={t('Выберите клиента')}
            options={selectOptions || []}
            value={selectClient?.id}
            onChange={onChangeHandler}
        />
    );
});
