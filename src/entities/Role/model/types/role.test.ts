import { getAccessLabel, hasAccessFlag } from './role';

describe('hasAccessFlag', () => {
    test('false when both flags are false', () => {
        expect(hasAccessFlag({ isAdmin: false, isDoctor: false })).toBe(false);
    });

    test('false when both flags are undefined', () => {
        expect(hasAccessFlag({})).toBe(false);
    });

    test('true when only isAdmin is true', () => {
        expect(hasAccessFlag({ isAdmin: true, isDoctor: false })).toBe(true);
    });

    test('true when only isDoctor is true', () => {
        expect(hasAccessFlag({ isAdmin: false, isDoctor: true })).toBe(true);
    });

    test('true when both flags are true', () => {
        expect(hasAccessFlag({ isAdmin: true, isDoctor: true })).toBe(true);
    });
});

describe('getAccessLabel', () => {
    test('returns fallback label when both flags are false', () => {
        expect(getAccessLabel({ isAdmin: false, isDoctor: false })).toBe('Сотрудник');
    });

    test('returns admin label only', () => {
        expect(getAccessLabel({ isAdmin: true, isDoctor: false })).toBe('Администратор');
    });

    test('returns doctor label only', () => {
        expect(getAccessLabel({ isAdmin: false, isDoctor: true })).toBe('Врач');
    });

    test('returns combined label when both flags are true', () => {
        expect(getAccessLabel({ isAdmin: true, isDoctor: true })).toBe('Администратор, Врач');
    });
});
