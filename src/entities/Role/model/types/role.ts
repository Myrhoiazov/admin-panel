export interface AccessFlags {
    isAdmin?: boolean;
    isDoctor?: boolean;
}

export const getAccessLabel = ({ isAdmin, isDoctor }: AccessFlags): string => {
    const labels = [isAdmin && 'Администратор', isDoctor && 'Врач'].filter(Boolean) as string[];
    return labels.length ? labels.join(', ') : 'Сотрудник';
};

export const hasAccessFlag = ({ isAdmin, isDoctor }: AccessFlags): boolean => Boolean(isAdmin || isDoctor);
