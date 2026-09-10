// export enum ClientStatus {
//     ALL = 'ALL',
//     BRONZE = 'BRONZE',
//     SILVER = 'SILVER',
//     GOLD = 'GOLD',
//     PLATINUM = 'PLATINUM'
// }

export enum ClientStatusKey {
    all = 'all',
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
}

/**
 * Дефолтные названия статусов — используются, пока не загружены (или если пусты)
 * настраиваемые названия из CompanySettings.clientStatusLabels (Настройки CRM →
 * Статусы клиентов). Ключи синхронны с серверным enum LoyaltyLevel.
 */
export const ClientStatusLabels: Record<ClientStatusKey, string> = {
    [ClientStatusKey.all]: "Все клиенты",
    [ClientStatusKey.BRONZE]: "Бронза",
    [ClientStatusKey.SILVER]: "Серебро",
    [ClientStatusKey.GOLD]: "Золото",
    [ClientStatusKey.PLATINUM]: "Платина",
};