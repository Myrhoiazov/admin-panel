import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import { getRouteAppointmentDetails } from '@/shared/const/router';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Dropdown } from '@/shared/ui/Popups';
import { Icon } from '@/shared/ui/Icon/Icon';
import Eddit from '@/shared/assets/icons/edit-icon.svg';
import { deleteAppoimentById } from '../../model/services/deleteAppoimentById';

interface EdditAppoimentDropdownProps {
    className?: string;
    appointmentId: string;
    reloadPage?: () => void;
}

export const EdditAppoimentDropdown = memo((props: EdditAppoimentDropdownProps) => {
    const { className, appointmentId, reloadPage } = props;

    const dispatch = useAppDispatch();

    const deleteAppoimentGandler = useCallback(async () => {
        const result = await dispatch(deleteAppoimentById(appointmentId));
        if (result.meta.requestStatus === 'fulfilled') {
            reloadPage?.();
        }
    }, [dispatch]);

    const items = [
        {
            content: 'Просмотреть',
            href: getRouteAppointmentDetails(String(appointmentId)),
        },
        {
            content: 'Удалить',
            onClick: deleteAppoimentGandler,
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
