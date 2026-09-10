import { IProfile, ValidateProfileError } from '../../types/profile';

export const validateProfileData = (profile?: IProfile) => {
    if (!profile) {
        return [ValidateProfileError.NO_DATA];
    }
    const { firstName, lastName, isAdmin, isDoctor } = profile;

    const errors: ValidateProfileError[] = [];

    if (!firstName || !lastName) {
        errors.push(ValidateProfileError.INCORRECT_USER_DATA);
    }

    if (!isAdmin && !isDoctor) {
        errors.push(ValidateProfileError.NO_ACCESS_ROLE);
    }

    return errors;
};
