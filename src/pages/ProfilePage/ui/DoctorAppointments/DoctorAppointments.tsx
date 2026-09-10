import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { Text } from '@/shared/ui/Text/Text';
import { VStack } from '@/shared/ui/Stack';
import { AppoimentList, Appointment } from '@/entities/Appointment';
import { EdditAppoimentDropdown } from '@/features/edditAppoimentDropdown';
import { fetchAppointmentsByDoctorId } from '../../model/services/fetchAppointmentsByDoctorId';
import { getDoctorAppointments, getDoctorAppointmentsIsLoading } from '../../model';

interface DoctorAppointmentsProps {
    doctorId?: string;
}

export const DoctorAppointments = memo(({ doctorId }: DoctorAppointmentsProps) => {
    const dispatch = useAppDispatch();
    const appointments = useSelector(getDoctorAppointments.selectAll);
    const isLoading = useSelector(getDoctorAppointmentsIsLoading);

    useInitialEffect(() => {
        dispatch(fetchAppointmentsByDoctorId(doctorId));
    });

    const reloadPage = useCallback(() => {
        dispatch(fetchAppointmentsByDoctorId(doctorId));
    }, [dispatch, doctorId]);

    return (
        <VStack gap="16" max>
            <Text size="l" title="Сеансы доктора" bold />
            <AppoimentList
                appoiments={appointments}
                isLoading={isLoading}
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
