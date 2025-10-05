import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import { getRouteProfile } from 'shared/const/router';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Dropdown } from 'shared/ui/Popups';
import { Icon } from 'shared/ui/Icon/Icon';
import Eddit from 'shared/assets/icons/edit-icon.svg';
import { deleteUserById } from '../../model/services/deleteUserById';
import { toast } from 'react-toastify';

interface EdditUserDropdownProps {
    className?: string;
    userId: string;
    reloadPage?: () => void;
}

export const EdditUserDropdown = memo((props: EdditUserDropdownProps) => {
    const { className, userId, reloadPage } = props;

    const dispatch = useAppDispatch();

    const deleteClientGandler = useCallback(async () => {
        const result = await dispatch(deleteUserById(userId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
            toast.info('Пользователь успешно удален');
        }
    }, [dispatch]);

    const items = [
        {
            content: 'Редактировать',
            href: getRouteProfile(String(userId)),
        },
        {
            content: 'Удалить',
            onClick: deleteClientGandler,
        },
    ];

    return (
        <Dropdown
            direction="bottom left"
            className={classNames('', {}, [className])}
            items={items}
            trigger={<Icon Svg={Eddit} width={24} height={24} color="stroke" />}
        />
    );
});
