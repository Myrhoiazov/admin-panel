import { Appointment } from "@/entities/Appointment";
import { ServerError } from "../consts/consts";
import { Procedure } from "@/entities/Procedure";
import { Client } from "@/entities/Client";
import { User } from "@/entities/User";

export interface AppointmentSchema {
    data?: Appointment,
    procedures?: Procedure[],
    clients?: Client[],
    doctors?: User[],
    isLoading: boolean,
    error?: string,
    readonly: boolean,
}