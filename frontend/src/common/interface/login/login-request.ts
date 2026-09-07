export enum LoginType{
    APP = "APP_DB"
};

export interface LoginRequest{
    username: string;
    password: string;
    type: string;
}