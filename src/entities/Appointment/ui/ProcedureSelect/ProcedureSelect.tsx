import { useTranslation } from 'react-i18next';
import { Select } from 'shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { Procedure } from 'entities/Procedure';

interface ProcedureSelectProps {
    className?: string;
    onChange?: (value: Procedure) => void;
    options?: Procedure[];
    value?: Procedure;
}

export const ProcedureSelect = memo((props: ProcedureSelectProps) => {
    const { className, value, onChange, options } = props;

    const { t } = useTranslation();

    const selectOptions = options?.map((procedure) => ({
        value: String(procedure.id),
        content: procedure.name ?? '',
    }));

    const onChangeHandler = useCallback(
        (id: string) => {
            const procedure = options?.find((p) => String(p.id) === id);
            onChange?.(procedure as Procedure);
        },
        [onChange, options]
    );

    const selectProcedure = useMemo(() => {
        return options?.find((p) => String(p.id) === String(value?.id));
    }, [value, options]);

    return (
        <Select
            defaultValue={t('Выберите процедуру')}
            className={classNames('', {}, [className])}
            label={t('Выберите процедуру')}
            options={selectOptions || []}
            value={selectProcedure?.id}
            onChange={onChangeHandler}
        />
    );
});
