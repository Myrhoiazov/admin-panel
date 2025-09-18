import { Client } from "entities/Client";
import { Procedure } from "entities/Procedure";
import { User } from "entities/User";

export interface Appointment {
    id?: string;
    clientId?: string;
    procedureId?: string;
    doctorId?: string;
    image?: File;

    note?: string;
    createdAt?: string;

    client?: Client;
    procedure?: Procedure;
    doctor?: User
}