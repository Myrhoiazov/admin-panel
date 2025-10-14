
import { StateSchema } from "@/app/providers/StoreProvider";

export const getAddAppoimentDoctors = (state: StateSchema) => state.addAppoimentForm?.doctors;