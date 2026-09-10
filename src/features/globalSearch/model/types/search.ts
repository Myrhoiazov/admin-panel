import { Client } from '@/entities/Client';
import { IProfile } from '@/entities/Profile';
import { Procedure } from '@/entities/Procedure';

export interface SearchAppointment {
    id: number;
    startAt: string;
    status: string;
    client?: {
        firstName?: string;
        lastName?: string;
    };
    doctor?: {
        firstName?: string;
        lastName?: string;
    };
}

export interface SearchResults {
    clients: Client[];
    appointments: SearchAppointment[];
    procedures: Procedure[];
    staff: IProfile[];
}

export const EMPTY_SEARCH_RESULTS: SearchResults = {
    clients: [],
    appointments: [],
    procedures: [],
    staff: [],
};
