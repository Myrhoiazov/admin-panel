import { Client } from "entities/Client";
import { Procedure } from "entities/Procedure";

export interface Appointment {
    id?: string;
    clientId?: string;
    procedureId?: string;
    image?: File;

    note?: string;
    createdAt?: string;

    client?: Client;
    procedure?: Procedure;
}