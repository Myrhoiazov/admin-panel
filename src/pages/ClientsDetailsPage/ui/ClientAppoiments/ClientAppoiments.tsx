import { useTranslation } from 'react-i18next';
import { memo, useCallback, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { classNames } from 'shared/lib/classNames/classNames';
import { Text } from 'shared/ui/Text/Text';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect';
import { VStack } from 'shared/ui/Stack';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getClientAppointments } from '../../model/slices/clientDetailsAppoimentsSlice';
import { getClientAppointmentsIsLoading } from 'pages/ClientsDetailsPage/model/selectors/appoiments';
import { AppoimentList, Appointment } from 'entities/Appointment';
import { fetchAppoimentsByClientId } from '../../model/services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';
import { EdditAppoimentDropdown } from 'features/edditAppoimentDropdown';

interface ClientAppoimentsProps {
    className?: string;
    id?: string;
}

export const ClientAppoiments = memo((props: ClientAppoimentsProps) => {
    const { className, id } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const appointments = useSelector(getClientAppointments.selectAll);
    const appointmentsIsLoading = useSelector(getClientAppointmentsIsLoading);

    useInitialEffect(() => {
        dispatch(fetchAppoimentsByClientId(id));
    });

    const reloadPage = useCallback(() => {
        dispatch(fetchAppoimentsByClientId(id));
    }, [dispatch, id]);

    return (
        <VStack gap="16" max className={classNames('', {}, [className])}>
            <Text size="l" title={t('Сеансы')} />
            <AppoimentList
                appoiments={appointments}
                isLoading={appointmentsIsLoading}
                renderAction={(appoiment: Appointment) => (
                    <EdditAppoimentDropdown
                        appointmentId={appoiment.id ?? ''}
                        reloadPage={reloadPage}
                    />
                )}
            />
        </VStack>
    );
});
