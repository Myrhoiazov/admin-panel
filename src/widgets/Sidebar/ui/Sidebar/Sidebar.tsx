import { memo, useMemo, useState } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button, ButtonSize, ButtonTheme } from 'shared/ui/Button';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import cls from './Sidebar.module.scss';
import { useSelector } from 'react-redux';
import { getSidebarItems } from '../../model/selectors/getSidebarItems';
import { AppImage } from 'shared/ui/AppImage';
import Logo from 'shared/assets/images/logo-gold.png';
import MobLogo from 'shared/assets/images/mob-logo.png';
import { VStack } from 'shared/ui/Stack';

interface SidebarProps {
    className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarItemsList = useSelector(getSidebarItems);

    const onToggle = () => {
        setCollapsed((prev) => !prev);
    };

    const itemList = useMemo(
        () =>
            (sidebarItemsList ?? []).map((item) => (
                <SidebarItem item={item} key={item.text} collapsed={collapsed} />
            )),
        [collapsed, sidebarItemsList]
    );

    return (
        <div
            data-testid="sidebar"
            className={classNames(cls.Sidebar, { [cls.collapsed]: collapsed }, [className])}
        >
            <Button
                data-testid="sidebar-toggle"
                onClick={onToggle}
                className={cls.collapseBtn}
                theme={ButtonTheme.BACKGROUND_INVERTED}
                size={ButtonSize.L}
                square
            >
                {collapsed ? '>' : '<'}
            </Button>
            <VStack align="center">
                <AppImage
                    src={collapsed ? MobLogo : Logo}
                    alt="Dr Rusakova clinic"
                    className={cls.logo}
                    width={collapsed ? 50 : 200}
                />
            </VStack>
            <div className={cls.items}>{itemList}</div>
        </div>
    );
});
