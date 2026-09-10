import { isValidUkrainianPhone, normalizeUkrainianPhone } from './isValidUkrainianPhone';

describe('isValidUkrainianPhone', () => {
    test('accepts a valid +380 number with 9 digits', () => {
        expect(isValidUkrainianPhone('+380501234567')).toBe(true);
    });

    test('accepts a number with spaces and dashes', () => {
        expect(isValidUkrainianPhone('+380 50-123-45-67')).toBe(true);
    });

    test('rejects empty/undefined input', () => {
        expect(isValidUkrainianPhone('')).toBe(false);
        expect(isValidUkrainianPhone(undefined)).toBe(false);
    });

    test('rejects a number without the +380 prefix', () => {
        expect(isValidUkrainianPhone('0501234567')).toBe(false);
    });

    test('rejects a number with too few digits', () => {
        expect(isValidUkrainianPhone('+38050123456')).toBe(false);
    });

    test('rejects a number with too many digits', () => {
        expect(isValidUkrainianPhone('+3805012345678')).toBe(false);
    });

    test('rejects a number with non-digit characters inside', () => {
        expect(isValidUkrainianPhone('+380501234a67')).toBe(false);
    });
});

describe('normalizeUkrainianPhone', () => {
    test('converts a local 0XXXXXXXXX number to +380XXXXXXXXX', () => {
        expect(normalizeUkrainianPhone('0501234567')).toBe('+380501234567');
    });

    test('adds the missing + to a bare 380XXXXXXXXX number', () => {
        expect(normalizeUkrainianPhone('380501234567')).toBe('+380501234567');
    });

    test('strips spaces and dashes before normalizing', () => {
        expect(normalizeUkrainianPhone('050-123-45-67')).toBe('+380501234567');
    });

    test('leaves an already-canonical number unchanged', () => {
        expect(normalizeUkrainianPhone('+380501234567')).toBe('+380501234567');
    });

    test('leaves unrecognizable/incomplete input as-is (still invalid)', () => {
        expect(normalizeUkrainianPhone('0986')).toBe('0986');
        expect(isValidUkrainianPhone(normalizeUkrainianPhone('0986'))).toBe(false);
    });

    test('returns empty string for empty/undefined input', () => {
        expect(normalizeUkrainianPhone('')).toBe('');
        expect(normalizeUkrainianPhone(undefined)).toBe('');
    });
});
