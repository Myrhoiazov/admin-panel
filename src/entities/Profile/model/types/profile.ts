export enum ValidateProfileError {
    INCORRECT_USER_DATA = 'INCORRECT_USER_DATA',
    INCORRECT_AGE = 'INCORRECT_AGE',
    INCORRECT_COUNTRY = 'INCORRECT_COUNTRY',
    INCORRECT_CITY = 'INCORRECT_CITY',
    INCORRECT_USERNAME = 'INCORRECT_USERNAME',
    NO_DATA = 'NO_DATA',
    SERVER_ERROR = 'SERVER_ERROR',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    NO_ACCESS_ROLE = 'NO_ACCESS_ROLE'
}

export interface IProfile {
    id?: string
    firstName?: string,
    lastName?: string,
    isAdmin?: boolean,
    isDoctor?: boolean,
    email?: string,
    avatar?: string
    birthYear?: number
    phoneNumber?: string
    telegram?: string
    position?: string
    specialization?: string
    bio?: string
    password?: string
    isTelegramLinked?: boolean
}

export interface ServerError {
    status: number;
    message?: string;
}

export interface ProfileSchema {
    data?: IProfile,
    form?: IProfile,
    isLoading: boolean,
    error?: ServerError
    readonly: boolean
    validateErrors?: ValidateProfileError[]
}
