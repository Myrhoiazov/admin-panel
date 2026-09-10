import React, { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './UsersList.module.scss';
import { VStack } from '@/shared/ui/Stack';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { IProfile } from '@/entities/Profile';
import UserListItem from '../UserListItem/UserListItem';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import UserIcon from '@/shared/assets/icons/user-filled.svg';

interface UsersListProps {
    className?: string;
    users: IProfile[];
    isLoading?: boolean;
    onDeleteSuccess?: () => void;
    emptyTitle?: string;
    emptyDescription?: string;
}

export const UsersList = memo((props: UsersListProps) => {
    const { className, isLoading, users, onDeleteSuccess, emptyTitle, emptyDescription } = props;

    if (!isLoading && !users.length) {
        return (
            <div className={classNames(s.UsersList, {}, [className])}>
                <EmptyState
                    icon={UserIcon}
                    title={emptyTitle || 'Пользователи не найдены'}
                    description={emptyDescription}
                />
            </div>
        );
    }

    const renderUser = (user: IProfile) => (
        <UserListItem className={s.card} user={user} key={user.id} onDeleteSuccess={onDeleteSuccess} />
    );

    return (
        <div className={classNames(s.UsersList, {}, [className])}>
            <VStack gap="16" max>
                {users.length > 0 ? users.map(renderUser) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
