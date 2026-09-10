export enum AppRoutes {
    MAIN = 'main',
    SETTINGS = 'settings',
    ABOUT = 'about',
    PROFILE = 'profile',
    CLIENTS = 'clients',
    CLIENT_DETAILS = 'client_details',
    PATIENT_DETAILS = 'patient_details',
    CLIENT_EDIT = 'client_edit',
    ADMIN_PANEL = 'admin_panel',
    FORBIDDEN = 'forbidden',
    APPOINTMENTS = 'appointments',
    // APPOINTMENT_DETAILS = 'appointment_details',
    PROCEDURES = 'procedures',
    PROCEDURE_DETAILS = 'procedure_details',
    PROCEDURE_EDIT = 'procedure_edit',
    PROCEDURE_CREATE = 'procedure_create',
    TRANSACTIONS = 'transactions',
    CALENDAR = 'calendar',
    TRANSACTION_DETAILS = 'transaction_details',
    TRANSACTION_EDIT = 'transaction_edit',
    TRANSACTION_CREATE = 'transaction_create',
    // last
    NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/';
export const getRouteSettings = () => '/settings';
export const getRouteAbout = () => '/about';
export const getRouteProfile = (id: string) => `/profile/${id}`;
export const getRouteClients = () => '/clients';
export const getRouteClientDetails = (id: string) => `/clients/${id}`;
export const getRoutePatientDetails = (id: string) => `/patients/${id}`;
export const getRouteClientEdit = (id: string) => `/clients/${id}/edit`;
export const getRouteAdmin = () => '/admin';
export const getRouteForbidden = () => '/forbidden';
export const getRouteAppointments = () => '/appointments';
export const getRouteAppointmentDetails = (id: string) => `/appointments/${id}`;
export const getRouteProcedures = () => '/procedures';
export const getRouteProcedureDetails = (id: string) => `/procedures/${id}`;
export const getRouteProcedureEdit = (id: string) => `/procedures/${id}/edit`;
export const getRouteProcedureCreate = () => '/procedures/new';
export const getRouteTransactions = () => '/transactions';
export const getRouteCalendar = () => '/calendar';
export const getRouteTransactionDetails = (id: string) => `/transactions/${id}`;
export const getRouteTransactionEdit = (id: string) => `/transactions/${id}/edit`;
export const getRouteTransactionCreate = () => '/transactions/new';
export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteSettings()]: AppRoutes.SETTINGS,
    [getRouteAbout()]: AppRoutes.ABOUT,
    [getRouteProfile(':id')]: AppRoutes.PROFILE,
    [getRouteClients()]: AppRoutes.CLIENTS,
    [getRouteClientDetails(':id')]: AppRoutes.CLIENT_DETAILS,
    [getRoutePatientDetails(':id')]: AppRoutes.PATIENT_DETAILS,
    [getRouteClientEdit(':id')]: AppRoutes.CLIENT_EDIT,
    [getRouteAdmin()]: AppRoutes.ADMIN_PANEL,
    [getRouteForbidden()]: AppRoutes.FORBIDDEN,
};
