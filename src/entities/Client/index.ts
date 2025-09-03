export { Client, ClientView } from './model/types/client';
export {
    ClientList
} from './ui/ClientList/ClientList';
export { ClientDetails } from './ui/ClientDetails/ClientDetails'
export { ClientCard } from './ui/ClientCard/ClientCard'

export { ClientSortField } from './model/consts/consts'

export type { ClientDetailsSchema } from './model/types/clientDetailsSchema'

export { getClientDetailsData } from './model/selectors/clientDetails'
export { ClientViewSelector } from './ui/ClientViewSelector/ClientViewSelector'