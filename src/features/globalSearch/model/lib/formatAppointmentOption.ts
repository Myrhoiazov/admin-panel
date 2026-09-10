import { SearchAppointment } from '../types/search';

export const formatAppointmentOption = (appointment: SearchAppointment): string => {
    const clientName = [appointment.client?.firstName, appointment.client?.lastName].filter(Boolean).join(' ').trim();
    const doctorName = [appointment.doctor?.firstName, appointment.doctor?.lastName].filter(Boolean).join(' ').trim();

    const date = new Date(appointment.startAt);
    const dateLabel = Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    const namePart = clientName || 'Без клиента';
    const doctorPart = doctorName ? ` (${doctorName})` : '';

    return dateLabel ? `${namePart} — ${dateLabel}${doctorPart}` : `${namePart}${doctorPart}`;
};
