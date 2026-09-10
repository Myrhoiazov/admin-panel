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

export { ClientAutocomplete, CLIENT_SEARCH_MIN_QUERY_LENGTH } from './ui/ClientAutocomplete/ClientAutocomplete'
export { formatClientOption } from './model/lib/formatClientOption'
export { isValidUkrainianPhone, normalizeUkrainianPhone } from './model/lib/isValidUkrainianPhone'