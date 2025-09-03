import { Procedure } from "entities/Procedure/model/types/procedure";

export interface AddProcedureFormSchema {
    isLoading: boolean;
    error?: string;
    data?: Procedure;
}