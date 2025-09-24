import { createSelector } from "@reduxjs/toolkit";
import { getUserAuthData } from "entities/User";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import AboutIcon from 'shared/assets/icons/about.svg';
import MainIcon from 'shared/assets/icons/main.svg';
import Clients from 'shared/assets/icons/clients.svg'
import Procedures from 'shared/assets/icons/procedures.svg'
import Sessions from 'shared/assets/icons/sessions.svg';
import Transactions from 'shared/assets/icons/transactions.svg';
import { SidebarItemType } from "../types/sidebar";
import { useSelector } from "react-redux";
import { RoleKey } from "entities/Role";


export const getSidebarItems = createSelector(getUserAuthData, () => {
    const userData = useSelector(getUserAuthData);

    const sidebarItemsList: SidebarItemType[] = [
        {
            path: RoutePath.main,
            Icon: MainIcon,
            text: 'Main'
        },
        {
            path: RoutePath.about,
            Icon: AboutIcon,
            text: 'About'
        },
        {
            path: RoutePath.clients,
            Icon: Clients,
            text: 'Клиенты',
        },
        {
            path: RoutePath.procedures,
            Icon: Procedures,
            text: 'Процедуры',
        },
        {
            path: RoutePath.appoiments,
            Icon: Sessions,
            text: 'Сеансы',
        },
    ]

    if (userData?.role === RoleKey.ADMIN) {
        sidebarItemsList.push({
            path: RoutePath.transactions,
            Icon: Transactions,
            text: 'Транзакции',
        })

    }

    return sidebarItemsList;
})