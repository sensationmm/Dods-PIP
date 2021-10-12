export interface PasswordUpdated {
    userName: string;
    lastPassword: string;
}

export enum LoginEventDetailTypes {
    NewUserCreated = 'NewUserCreated',
    PasswordUpdated = 'PasswordUpdated'
}

export enum EventSources {
    Login = 'Login'
}