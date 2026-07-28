export interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    birthYear?: number;
    phoneNumber?: string;
    telegram?: string;
    position?: string;
    specialization?: string;
    bio?: string;
    email: string;
    isAdmin: boolean;
    isDoctor: boolean;
}

export interface UserSchema {
    authData?: User;

    _inited: boolean;
}
