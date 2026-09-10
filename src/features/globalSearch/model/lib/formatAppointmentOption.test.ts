import { formatAppointmentOption } from './formatAppointmentOption';

const START_AT = '2026-06-22T08:00:00.000Z';
// Derived the same way the function itself formats it, so this test doesn't depend on the
// runner's timezone (toLocaleString uses the local timezone, which differs between machines/CI).
const DATE_LABEL = new Date(START_AT).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

describe('formatAppointmentOption', () => {
    test('combines client name, date/time, and doctor name', () => {
        expect(formatAppointmentOption({
            id: 1,
            startAt: START_AT,
            status: 'SCHEDULED',
            client: { firstName: 'Oksana', lastName: 'Pavlenko' },
            doctor: { firstName: 'Anna', lastName: 'Doctor' },
        })).toBe(`Oksana Pavlenko — ${DATE_LABEL} (Anna Doctor)`);
    });

    test('falls back to "Без клиента" when client is missing', () => {
        expect(formatAppointmentOption({
            id: 1,
            startAt: START_AT,
            status: 'SCHEDULED',
        })).toBe(`Без клиента — ${DATE_LABEL}`);
    });

    test('omits doctor part when doctor is missing', () => {
        expect(formatAppointmentOption({
            id: 1,
            startAt: START_AT,
            status: 'SCHEDULED',
            client: { firstName: 'Oksana', lastName: 'Pavlenko' },
        })).toBe(`Oksana Pavlenko — ${DATE_LABEL}`);
    });

    test('handles an invalid date gracefully', () => {
        expect(formatAppointmentOption({
            id: 1,
            startAt: 'not-a-date',
            status: 'SCHEDULED',
            client: { firstName: 'Oksana', lastName: 'Pavlenko' },
        })).toBe('Oksana Pavlenko');
    });
});
