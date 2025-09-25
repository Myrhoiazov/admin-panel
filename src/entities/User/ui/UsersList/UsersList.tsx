import React, { memo, ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './UsersList.module.scss';
import { Text } from 'shared/ui/Text/Text';
import { VStack } from 'shared/ui/Stack';
import { Skeleton } from 'shared/ui/Skeleton/Skeleton';
import { IProfile } from 'entities/Profile';
import UserListItem from '../UserListItem/UserListItem';

interface UsersListProps {
    className?: string;
    users: IProfile[];
    isLoading?: boolean;
    renderAction?: (client: IProfile) => ReactNode;
}

export const UsersList = memo((props: UsersListProps) => {
    const { className, isLoading, users, renderAction } = props;

    if (!isLoading && !users.length) {
        return (
            <div className={classNames(s.ArticleList, {}, [])}>
                <Text size="l" title="Пользователи не найдены" className={s.title} />
            </div>
        );
    }

    const renderUser = (user: IProfile) => (
        <UserListItem className={s.card} user={user} key={user.id} renderAction={renderAction} />
    );

    return (
        <div className={classNames(s.UsersList, {}, [className])}>
            <VStack gap="16">
                {users.length > 0 ? users.map(renderUser) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
