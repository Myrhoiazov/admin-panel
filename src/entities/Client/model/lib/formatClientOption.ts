import { Client } from '../types/client';

export const formatClientOption = (client: Client): string => {
    const fullName = [client.firstName, client.lastName].filter(Boolean).join(' ').trim();
    const phone = client.phoneNumber?.trim();

    if (fullName && phone) return `${fullName} — ${phone}`;
    return fullName || phone || 'Без имени';
};
