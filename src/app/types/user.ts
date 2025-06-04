import { Role } from "./role";
import { Staff } from "./staff";

export type User = {
    id?: number;
    fullName: string;
    email: string;
    pwd?: string;
    phone: string;
    roles: Role[];
    staff: Staff;
};
