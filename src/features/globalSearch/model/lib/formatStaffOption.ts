import { IProfile } from '@/entities/Profile';

export const formatStaffOption = (user: IProfile): string => {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    const role = user.position?.trim() || user.email?.trim();

    if (fullName && role) return `${fullName} — ${role}`;
    return fullName || role || 'Без имени';
};
