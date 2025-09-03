import { StateSchema } from 'app/providers/StoreProvider';

export const getProcedureFormData = (state: StateSchema) => state.addProcedureForm?.data;
export const getProcedureFormIsLoading = (state: StateSchema) => state.addProcedureForm?.isLoading || false;
export const getProcedureFormError = (state: StateSchema) => state.addProcedureForm?.error;
