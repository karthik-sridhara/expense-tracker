import { Role } from "../../enum/role";

export interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    role: Role;
    passwordExpired: boolean;
}
   