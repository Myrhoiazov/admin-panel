import { useTranslation } from 'react-i18next';
import { Select } from '@/shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { User } from '@/entities/User';

interface DoctorSelectProps {
    className?: string;
    onChange?: (value: User) => void;
    options?: User[];
    value?: User;
}

export const DoctorSelect = memo((props: DoctorSelectProps) => {
    const { className, value, onChange, options } = props;
    const { t } = useTranslation();

    const selectOptions = options?.map((doctor) => {
        const fullName = `${doctor.firstName}`;
        return {
            value: String(doctor.id),
            content: fullName ?? '',
        };
    });

    const onChangeHandler = useCallback(
        (id: string) => {
            const doctor = options?.find((p) => String(p.id) === id);
            onChange?.(doctor as User);
        },
        [onChange, options]
    );

    const selectDoctor = useMemo(() => {
        return options?.find((p) => String(p.id) === String(value?.id));
    }, [value, options]);

    return (
        <Select
            defaultValue={t('Выберите доктора')}
            className={classNames('', {}, [className])}
            label={t('Выберите доктора')}
            options={selectOptions || []}
            value={selectDoctor?.id}
            onChange={onChangeHandler}
        />
    );
});
