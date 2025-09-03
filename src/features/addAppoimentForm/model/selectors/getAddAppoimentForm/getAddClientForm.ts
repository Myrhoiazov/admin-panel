import { StateSchema } from "app/providers/StoreProvider";

export const getAddAppoimentForm = (state: StateSchema) => state.addAppoimentForm?.data;