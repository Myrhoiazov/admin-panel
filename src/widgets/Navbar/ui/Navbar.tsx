import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';
import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { HStack } from '@/shared/ui/Stack';
import { AvatarDropdown } from '@/features/avatarDropdown';
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher';
import { LangSwitcher } from '@/shared/ui/LangSwitcher/LangSwitcher';
import { Icon } from '@/shared/ui/Icon/Icon';
import { GlobalSearch } from '@/features/globalSearch';
import { Button } from '@/shared/ui/Button';
import AddClientIcon from '@/shared/assets/icons/add_user_icon.svg';
import SessionIcon from '@/shared/assets/icons/sessions.svg';
import { getAccessLabel } from '@/entities/Role';
import { ClientFormModal } from '@/features/addClientForm';
import { AppoimentFormModal } from '@/features/addAppoimentForm';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const authData = useSelector(getUserAuthData);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isAddAppoimentModalOpen, setIsAddAppoimentModalOpen] = useState(false);

    if (!authData) {
        return;
    }

    const displayName = [authData.firstName, authData.lastName].filter(Boolean).join(' ') || authData.username || authData.email;
    const roleLabel = getAccessLabel(authData);

    const openAddClientModal = useCallback(() => {
        setIsAddClientModalOpen(true);
    }, []);

    const closeAddClientModal = useCallback(() => {
        setIsAddClientModalOpen(false);
    }, []);

    const openAddAppoimentModal = useCallback(() => {
        setIsAddAppoimentModalOpen(true);
    }, []);

    const closeAddAppoimentModal = useCallback(() => {
        setIsAddAppoimentModalOpen(false);
    }, []);

    return (
        <div className={classNames(cls.Navbar, {}, [className])}>
            <div className={cls.left}>
                <GlobalSearch className={cls.search} />
            </div>
            <HStack justify="end" gap="16" className={cls.right}>
                <Button className={cls.quickBtn} onClick={openAddClientModal}>
                    <Icon Svg={AddClientIcon} width={18} height={18} color="stroke" />
                    Новый клиент
                </Button>
                <Button className={cls.quickBtn} onClick={openAddAppoimentModal}>
                    <Icon Svg={SessionIcon} width={18} height={18} color="stroke" />
                    Создать запись
                </Button>
                <span className={cls.divider} />
                <LangSwitcher className={cls.lang} />
                <ThemeSwitcher />
                <div className={cls.profileInfo}>
                    <span className={cls.profileName}>{displayName}</span>
                    <span className={cls.profileRole}>{roleLabel}</span>
                </div>
                <AvatarDropdown />
            </HStack>
            <ClientFormModal isOpen={isAddClientModalOpen} onClose={closeAddClientModal} />
            <AppoimentFormModal isOpen={isAddAppoimentModalOpen} onClose={closeAddAppoimentModal} />
        </div>
    );
});
