import { formatClientOption } from './formatClientOption';

describe('formatClientOption', () => {
    test('combines full name and phone', () => {
        expect(formatClientOption({ firstName: 'Анна', lastName: 'Коваль', phoneNumber: '+380501234567' }))
            .toBe('Анна Коваль — +380501234567');
    });

    test('falls back to name only when phone is missing', () => {
        expect(formatClientOption({ firstName: 'Анна', lastName: 'Коваль' })).toBe('Анна Коваль');
    });

    test('falls back to phone only when name is missing', () => {
        expect(formatClientOption({ phoneNumber: '+380501234567' })).toBe('+380501234567');
    });

    test('handles only firstName without lastName', () => {
        expect(formatClientOption({ firstName: 'Анна', phoneNumber: '+380501234567' }))
            .toBe('Анна — +380501234567');
    });

    test('returns fallback label when both name and phone are missing', () => {
        expect(formatClientOption({})).toBe('Без имени');
    });
});
