import { Appointment } from "entities/Appointment";
import { ServerError } from "../consts/consts";
import { Procedure } from "entities/Procedure";
import { Client } from "entities/Client";

export interface AppointmentSchema {
    data?: Appointment,
    procedures?: Procedure[],
    clients?: Client[],
    isLoading: boolean,
    error?: string,
    readonly: boolean,
}