import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import CheckBox from '@/shared/ui/CheckBox/CheckBox';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';

interface RoleSelectProps {
    className?: string;
    isAdmin?: boolean;
    isDoctor?: boolean;
    onChangeIsAdmin?: (value: boolean) => void;
    onChangeIsDoctor?: (value: boolean) => void;
    readonly?: boolean;
    error?: string;
}

export const RoleSelect = memo((props: RoleSelectProps) => {
    const { className, isAdmin, isDoctor, onChangeIsAdmin, onChangeIsDoctor, readonly, error } = props;

    return (
        <VStack gap="8" max className={classNames('', {}, [className])}>
            <CheckBox label="Администратор" value={Boolean(isAdmin)} readOnly={readonly} onChange={readonly ? undefined : onChangeIsAdmin} />
            <CheckBox label="Врач" value={Boolean(isDoctor)} readOnly={readonly} onChange={readonly ? undefined : onChangeIsDoctor} />
            {error && <Text variant="error" text={error} />}
        </VStack>
    );
});
