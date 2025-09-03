import { useTranslation } from 'react-i18next';
import { Select } from 'shared/ui/Select/Select';
import { memo, useCallback, useMemo } from 'react';
import { Role } from '../../model/types/role';
import { classNames } from 'shared/lib/classNames/classNames';

interface RoleSelectProps {
    className?: string;
    value?: Role;
    onChange?: (value: Role) => void;
    readonly?: boolean;
}

const options = [
    { value: Role.ADMIN, content: Role.ADMIN },
    { value: Role.MANAGER, content: Role.MANAGER },
    { value: Role.GUEST, content: Role.GUEST },
];

export const RoleSelect = memo(({ className, value, onChange, readonly }: RoleSelectProps) => {
    const { t } = useTranslation();

    const onChangeHandler = useCallback(
        (value: string) => {
            onChange?.(value as Role);
        },
        [onChange]
    );

    const selectRole = useMemo(() => {
        return Role[value as unknown as keyof typeof Role];
    }, [value]);

    return (
        <Select
            className={classNames('', {}, [className])}
            label={t('Укажите роль')}
            options={options}
            value={selectRole}
            onChange={onChangeHandler}
            readonly={readonly}
        />
    );
});
