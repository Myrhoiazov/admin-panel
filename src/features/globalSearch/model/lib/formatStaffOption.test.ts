import { formatStaffOption } from './formatStaffOption';

describe('formatStaffOption', () => {
    test('combines full name and position', () => {
        expect(formatStaffOption({ firstName: 'Anna', lastName: 'Doctor', position: 'Дерматолог' }))
            .toBe('Anna Doctor — Дерматолог');
    });

    test('falls back to email when position is missing', () => {
        expect(formatStaffOption({ firstName: 'Anna', lastName: 'Doctor', email: 'anna@liza.local' }))
            .toBe('Anna Doctor — anna@liza.local');
    });

    test('falls back to name only when neither position nor email is present', () => {
        expect(formatStaffOption({ firstName: 'Anna', lastName: 'Doctor' })).toBe('Anna Doctor');
    });

    test('falls back to email only when name is missing', () => {
        expect(formatStaffOption({ email: 'anna@liza.local' })).toBe('anna@liza.local');
    });

    test('falls back to "Без имени" when nothing is present', () => {
        expect(formatStaffOption({})).toBe('Без имени');
    });
});
