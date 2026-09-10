import { createSelector } from "@reduxjs/toolkit";
import { getUserAuthData } from "@/entities/User";
import { RoutePath } from "@/shared/config/routeConfig/routeConfig";
import Dashboard from '@/shared/assets/icons/tiled-24-24.svg';
import Company from '@/shared/assets/icons/user-filled.svg';
import Settings from '@/shared/assets/icons/add_user_icon.svg';
import Clients from '@/shared/assets/icons/clients.svg'
import Procedures from '@/shared/assets/icons/procedures.svg'
import Sessions from '@/shared/assets/icons/sessions.svg';
import Transactions from '@/shared/assets/icons/transactions.svg';
import Calendar from '@/shared/assets/icons/calendar-20-20.svg';
import { SidebarItemType } from "../types/sidebar";
import { getRouteProfile } from "@/shared/const/router";


export const getSidebarItems = createSelector(
    getUserAuthData,
    (userData) => {
        const companyChildren: SidebarItemType[] = [
            { path: `${RoutePath.about}#main`, Icon: Dashboard, text: 'Главная' },
            { path: `${RoutePath.about}#employees`, Icon: Company, text: 'Сотрудники' },
            ...(userData?.isAdmin
                ? [{ path: RoutePath.transactions, Icon: Transactions, text: 'Финансы' }]
                : []),
        ];

        const settingsChildren: SidebarItemType[] = [
            { path: RoutePath.settings, Icon: Settings, text: 'Настройки CRM' },
            ...(userData?.isAdmin
                ? [{ path: RoutePath.integrations, Icon: Settings, text: 'Сервисы и провайдеры' }]
                : []),
        ];

        if (userData?.id) {
            settingsChildren.push({
                path: getRouteProfile(userData.id),
                Icon: Dashboard,
                text: 'Мой профиль',
            });
        }

        const sidebarItemsList: SidebarItemType[] = [
            { path: RoutePath.main, Icon: Dashboard, text: 'Главная' },
            { path: RoutePath.clients, Icon: Clients, text: 'Клиенты' },
            { path: RoutePath.procedures, Icon: Procedures, text: 'Процедуры' },
            { path: RoutePath.appointments, Icon: Sessions, text: 'Сеансы' },
            { path: RoutePath.calendar, Icon: Calendar, text: 'Календарь' },
            {
                Icon: Company,
                text: 'Компания',
                children: companyChildren,
                defaultExpanded: true,
            },
            {
                Icon: Settings,
                text: 'Настройки CRM',
                children: settingsChildren,
                defaultExpanded: false,
            },
        ];

        return sidebarItemsList;
    }
);
