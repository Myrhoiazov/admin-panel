import { StateSchema } from "@/app/providers/StoreProvider";


export const getProcedureDetailsData = (state: StateSchema) =>
    state.procedureDetails?.data;
export const getProcedureDetailsIsLoading = (state: StateSchema) =>
    state.procedureDetails?.isLoading || false;
export const getProcedureDetailsError = (state: StateSchema) =>
    state.procedureDetails?.error;
