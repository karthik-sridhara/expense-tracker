import { Role } from "../../enum/role";

export interface LoggedUser {
    userId: number;
    email: string;
    name: string;
    role: Role;
}