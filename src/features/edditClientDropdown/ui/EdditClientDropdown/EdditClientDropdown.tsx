import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import { getRouteClientDetails, getRouteClients } from 'shared/const/router';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Dropdown } from 'shared/ui/Popups';
import { Icon } from 'shared/ui/Icon/Icon';
import Eddit from 'shared/assets/icons/edit-icon.svg';
import { deleteClientById } from '../../model/services/deleteClientById';

interface EdditClientDropdownProps {
    className?: string;
    clientId: string;
    reloadPage?: () => void;
}

export const EdditClientDropdown = memo((props: EdditClientDropdownProps) => {
    const { className, clientId, reloadPage } = props;

    const dispatch = useAppDispatch();

    const deleteClientGandler = useCallback(async () => {
        const result = await dispatch(deleteClientById(clientId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
        }
    }, [dispatch]);

    const items = [
        {
            content: 'Процедуры',
            href: getRouteClients(),
        },
        {
            content: 'Редактировать',
            href: getRouteClientDetails(String(clientId)),
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
