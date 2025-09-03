import { Procedure } from "./procedure";

export interface ProcedureDetailsSchema {
    isLoading: boolean;
    error?: string;
    data?: Procedure;
}