import React, { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './UserListItem.module.scss';
import { Card } from '@/shared/ui/Card/Card';
import { Icon } from '@/shared/ui/Icon/Icon';
import EyeIcon from '@/shared/assets/icons/eye-20-20.svg';
import TrashIcon from '@/shared/assets/icons/trash-icon.svg';
import { IProfile } from '@/entities/Profile';
import { getAccessLabel } from '@/entities/Role';
import { getRouteProfile } from '@/shared/const/router';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { deleteUserById } from '@/features/edditUserDropdown/model/services/deleteUserById';
import { ConfirmActionModal } from '@/features/confirmAction';
import { toast } from 'react-toastify';

interface UserListItemProps {
    className?: string;
    user: IProfile;
    onDeleteSuccess?: () => void;
}

const UserListItem = (props: UserListItemProps) => {
    const { className, user, onDeleteSuccess } = props;

    const authData = useSelector(getUserAuthData);
    const isAdmin = Boolean(authData?.isAdmin);
    const dispatch = useAppDispatch();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const roleLabel = getAccessLabel(user);

    const handleDelete = useCallback(async () => {
        const result = await dispatch(deleteUserById(String(user.id ?? '')));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.info('Пользователь удалён');
            setIsDeleteOpen(false);
            onDeleteSuccess?.();
        }
    }, [dispatch, user.id, onDeleteSuccess]);

    return (
        <>
            <Card
                padding="16"
                fullWidth
                shadow="shadowLight"
                className={classNames(s.UserListItem, {}, [className])}
            >
                <div className={s.grid}>
                    <p className={classNames(s.cell, {}, [s.nameCell])}>
                        {user.firstName} {user.lastName}
                    </p>
                    <p className={s.cell}>{user.email}</p>
                    <p className={classNames(s.cell, {}, [s.roleCell])}>{roleLabel}</p>
                    <div className={s.actions}>
                        <Link
                            className={s.actionBtn}
                            to={getRouteProfile(String(user.id))}
                            title="Просмотреть профиль"
                        >
                            <Icon Svg={EyeIcon} width={18} height={18} color="stroke" />
                        </Link>
                        {isAdmin && (
                            <button
                                className={classNames(s.actionBtn, {}, [s.deleteBtn])}
                                onClick={() => setIsDeleteOpen(true)}
                                title="Удалить пользователя"
                            >
                                <Icon Svg={TrashIcon} width={18} height={18} />
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            <ConfirmActionModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Удалить пользователя?"
                description="Это действие нельзя отменить."
                cancelText="Отменить"
                confirmText="Удалить"
            />
        </>
    );
};

export default memo(UserListItem);
