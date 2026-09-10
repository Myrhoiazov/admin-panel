import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@/shared/ui/Text/Text';
import { VStack } from '@/shared/ui/Stack';
import { Link } from 'react-router-dom';
import { getRouteClientDetails } from '@/shared/const/router';
import { getDoctorAppointments } from '../../model';
import s from './DoctorClients.module.scss';

interface DoctorClientsProps {
    doctorId?: string;
}

export const DoctorClients = memo(({ doctorId }: DoctorClientsProps) => {
    const appointments = useSelector(getDoctorAppointments.selectAll);

    const uniqueClients = useMemo(() => {
        const seen = new Set<string>();
        const clients: Array<{ id: string | number; firstName: string; lastName: string; email: string }> = [];
        for (const appt of appointments) {
            const clientId = String(appt.client?.id ?? '');
            if (appt.client && clientId && !seen.has(clientId)) {
                seen.add(clientId);
                clients.push(appt.client as any);
            }
        }
        return clients;
    }, [appointments]);

    if (!appointments.length && !uniqueClients.length) return null;

    return (
        <VStack gap="16" max>
            <Text size="l" title={`Клиенты доктора (${uniqueClients.length})`} bold />
            {uniqueClients.length === 0 ? (
                <Text text="Нет клиентов" />
            ) : (
                <div className={s.grid}>
                    {uniqueClients.map((client) => (
                        <Link
                            key={client.id}
                            to={getRouteClientDetails(String(client.id))}
                            className={s.card}
                        >
                            <span className={s.name}>
                                {client.firstName} {client.lastName}
                            </span>
                            <span className={s.email}>{client.email}</span>
                        </Link>
                    ))}
                </div>
            )}
        </VStack>
    );
});
