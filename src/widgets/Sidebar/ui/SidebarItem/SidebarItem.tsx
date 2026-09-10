import { AppLink, AppLinkTheme } from '@/shared/ui/AppLink/AppLink';
import cls from './SidebarItem.module.scss';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { SidebarItemType } from '@/widgets/Sidebar/model/types/sidebar';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { useLocation } from 'react-router-dom';

interface SidebarItemProps {
    item: SidebarItemType;
    collapsed: boolean;
    level?: number;
}

export const SidebarItem = memo(({ item, collapsed, level = 0 }: SidebarItemProps) => {
    const { t } = useTranslation();
    const isAuth = useSelector(getUserAuthData);
    const { pathname } = useLocation();
    const [expanded, setExpanded] = useState(Boolean(item.defaultExpanded));

    const hasChildren = Boolean(item.children?.length);

    if (item.authOnly && !isAuth) {
        return null;
    }

    const children = useMemo(
        () => (item.children || []).map((child) => (
            <SidebarItem
                key={`${item.text}-${child.text}`}
                item={child}
                collapsed={collapsed}
                level={level + 1}
            />
        )),
        [collapsed, item.children, item.text, level],
    );

    if (hasChildren) {
        const hasActiveChild = (item.children || []).some((child) => child.path && pathname.startsWith(child.path));

        return (
            <div className={classNames(cls.group, { [cls.groupCollapsed]: collapsed })}>
                <Button
                    theme={ButtonTheme.CLEAR}
                    className={classNames(cls.groupTrigger, { [cls.collapsed]: collapsed, [cls.active]: hasActiveChild })}
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    <Icon Svg={item.Icon} width={23} height={23} className={cls.icon} color="stroke" />
                    <span className={cls.link}>{t(item.text)}</span>
                    {!collapsed && <span className={cls.chevron}>{expanded ? '▾' : '▸'}</span>}
                </Button>
                {!collapsed && expanded && <div className={cls.children}>{children}</div>}
            </div>
        );
    }

    const isActive = Boolean(item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`)));

    return (
        <AppLink
            theme={AppLinkTheme.SECONDARY}
            to={item.path || '/'}
            className={classNames(
                cls.item,
                {
                    [cls.collapsed]: collapsed,
                    [cls.childItem]: level > 0,
                    [cls.active]: isActive,
                },
            )}
        >
            <Icon Svg={item.Icon} width={level > 0 ? 16 : 25} height={level > 0 ? 16 : 25} className={cls.icon} color="stroke" />
            <span className={cls.link}>{t(item.text)}</span>
        </AppLink>
    );
});
