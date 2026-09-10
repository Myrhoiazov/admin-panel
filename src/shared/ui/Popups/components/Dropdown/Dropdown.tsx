import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { DropdownDirection } from '@/shared/types/ui';
import { AppLink } from '../../../AppLink/AppLink';
import cls from './Dropdown.module.scss';
import popupCls from '../../styles/popup.module.scss';

export interface DropdownItem {
    disabled?: boolean;
    content?: ReactNode;
    onClick?: () => void;
    href?: string;
}

interface DropdownProps {
    className?: string;
    items: DropdownItem[];
    direction?: DropdownDirection;
    trigger: ReactNode;
    variant?: 'default' | 'profile';
}

const anchorByDirection: Record<DropdownDirection, 'bottom end' | 'bottom start' | 'top end' | 'top start'> = {
    'bottom left': 'bottom end',
    'bottom right': 'bottom start',
    'top left': 'top end',
    'top right': 'top start',
};

export function Dropdown(props: DropdownProps) {
    const {
        className,
        trigger,
        items,
        direction = 'bottom right',
        variant = 'default',
    } = props;

    const menuClasses = [popupCls.menu];
    const isProfile = variant === 'profile';

    return (
        <Menu
            as="div"
            className={classNames(
                cls.Dropdown,
                {
                    [cls.profile]: isProfile,
                },
                [className, popupCls.popup],
            )}
        >
            <MenuButton className={popupCls.trigger}>{trigger}</MenuButton>
            <MenuItems
                transition
                portal
                anchor={{ to: anchorByDirection[direction], gap: 8, padding: 12 }}
                className={classNames(cls.menu, {}, menuClasses)}
            >
                {items.map((item, index) => {
                    const content = ({ active }: { active: boolean }) => (
                        <button
                            type="button"
                            disabled={item.disabled}
                            onClick={item.onClick}
                            className={classNames(cls.item, {
                                [popupCls.active]: active && !isProfile,
                                [cls.itemActive]: active && isProfile,
                            })}
                        >
                            {item.content}
                        </button>
                    );

                    if (item.href) {
                        return (
                            <MenuItem
                                as={AppLink}
                                to={item.href}
                                disabled={item.disabled}
                                key={`dropdown-key-${index}`}
                            >
                                {content}
                            </MenuItem>
                        );
                    }

                    return (
                        <MenuItem
                            key={`dropdown-key-${index}`}
                            as={Fragment}
                            disabled={item.disabled}
                        >
                            {content}
                        </MenuItem>
                    );
                })}
            </MenuItems>
        </Menu>
    );
}
