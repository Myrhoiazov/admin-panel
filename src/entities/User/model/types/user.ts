export interface User {
    id: string;
    username: string;
    firstName?: string;
    avatar?: string;
    token?: string;
}

export interface UserSchema {
    authData?: User;

    _inited: boolean;
}
