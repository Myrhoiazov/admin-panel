import { classNames } from 'shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from 'entities/User';
import { HStack } from 'shared/ui/Stack';
import { AvatarDropdown } from 'features/avatarDropdown';
import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher';
import { LangSwitcher } from 'shared/ui/LangSwitcher/LangSwitcher';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const authData = useSelector(getUserAuthData);

    if (!authData) {
        return;
    }

    return (
        <div className={classNames(cls.Navbar, {}, [className])}>
            <HStack max justify="end" gap="32">
                <LangSwitcher className={cls.lang} />
                <ThemeSwitcher />
                <AvatarDropdown />
            </HStack>
        </div>
    );
});
