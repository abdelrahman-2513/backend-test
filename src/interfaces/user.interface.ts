import { EUserRole } from "../enums/user-role.enum";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    role:EUserRole
}