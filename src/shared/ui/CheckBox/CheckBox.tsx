import { Checkbox } from '@headlessui/react';
import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './CheckBox.module.scss';
import { HStack } from '../Stack';
import { Text } from '../Text/Text';
import CheckIcon from '@/shared/assets/icons/check.svg';
import { Icon } from '../Icon/Icon';

interface CheckBoxProps {
    className?: string;
    label?: string;
    value: boolean;
    readOnly?: boolean;
    onChange?: (checked: boolean) => void;
    /** Renders the checkbox directly next to its label instead of pushing it to the far edge — use in grids/lists where items sit close together. */
    compact?: boolean;
}

const CheckBox = ({ className, value, label, onChange, readOnly, compact }: CheckBoxProps) => {
    const onChangeHandler = (checked: boolean) => {
        onChange?.(checked);
    };

    const checkbox = (
        <Checkbox
            checked={value}
            disabled={readOnly}
            onChange={onChangeHandler}
            className={classNames(s.CheckBox, { [s.readonly]: !!readOnly }, [className])}
        >
            {value && <Icon Svg={CheckIcon} width={14} height={14} color="stroke" />}
        </Checkbox>
    );

    if (label) {
        if (compact) {
            return (
                <HStack gap="8" align="center">
                    {checkbox}
                    <Text text={label} />
                </HStack>
            );
        }

        return (
            <HStack max gap="16" justify="between" align="center">
                <Text text={label} />
                {checkbox}
            </HStack>
        );
    }

    return checkbox;
};

export default memo(CheckBox);
