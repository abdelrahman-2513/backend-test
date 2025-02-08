import { IUser } from "./user.interface";

export interface IStats {
    id: number;
    user: IUser;
    totalLogins: number;
    lastLogin: Date;
    createdAt: Date;
}