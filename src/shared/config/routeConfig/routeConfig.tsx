import { RouteProps } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ClientsPage } from '@/pages/ClientsPage';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/AuthPage';
import { ClientsDetailsPage } from '@/pages/ClientsDetailsPage';
import { ProceduresPage } from '@/pages/ProceduresPage';
import { ProcedureEditPage } from '@/pages/ProcedureEditPage';
import { ProcedureDetailsPage } from '@/pages/ProcedureDetailsPage';
import { ProcedureCreatePage } from '@/pages/ProcedureCreatePage';
import { AppoimentsPage } from '@/pages/AppoimentsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { AppoimentDetailPage } from '@/pages/AppoimentDetailPage';
import { PatientDetailsPage } from '@/pages/PatientDetailsPage';
import { CalendarPage } from '@/pages/CalendarPage';

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    LOGIN = 'login',
    FORGOT_PASSWORD = 'forgot_password',
    RESET_PASSWORD = 'reset_password',
    MAIN = 'main',
    ABOUT = 'about',
    APPOINTMENTS = 'appointments',
    APPOINTMENT_DETAILS = 'appointment_details',
    PROFILE = 'profile',
    TRANSACTIONS = 'transactions',
    CLIENTS = 'clients',
    CLIENTS_DETAILS = 'client_details',
    PATIENT_DETAILS = 'patient_details',
    PROCEDURES = 'procedures',
    PROCEDURES_DETAILS = 'procedures_details',
    PROCEDURES_EDIT = 'procedures_edit',
    PROCEDURES_CREATE = 'procedures_create',
    SETTINGS = 'settings',
    INTEGRATIONS = 'integrations',
    CALENDAR = 'calendar',
    // last
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.FORGOT_PASSWORD]: '/forgot-password',
    [AppRoutes.RESET_PASSWORD]: '/reset-password',
    [AppRoutes.ABOUT]: '/about',
    [AppRoutes.APPOINTMENTS]: '/appointments',
    [AppRoutes.PROFILE]: '/profile/',
    [AppRoutes.TRANSACTIONS]: '/transactions',
    [AppRoutes.CLIENTS]: '/clients',
    [AppRoutes.CLIENTS_DETAILS]: '/clients/',
    [AppRoutes.PATIENT_DETAILS]: '/patients/',
    [AppRoutes.PROCEDURES]: '/procedures',
    [AppRoutes.PROCEDURES_CREATE]: '/procedures/create',
    [AppRoutes.PROCEDURES_DETAILS]: '/procedures/', // :id
    [AppRoutes.PROCEDURES_EDIT]: '/procedures/edit/', // :id
    [AppRoutes.APPOINTMENT_DETAILS]: '/appointments/', // + :id
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.INTEGRATIONS]: '/settings/integrations',
    [AppRoutes.CALENDAR]: '/calendar',
    // последний
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage />,
    },
    [AppRoutes.FORGOT_PASSWORD]: {
        path: RoutePath.forgot_password,
        element: <ForgotPasswordPage />,
    },
    [AppRoutes.RESET_PASSWORD]: {
        path: RoutePath.reset_password,
        element: <ResetPasswordPage />,
    },
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <HomePage />,
        authOnly: true,
    },
    [AppRoutes.ABOUT]: {
        path: RoutePath.about,
        element: <AboutPage />,
        authOnly: true,
    },
    [AppRoutes.APPOINTMENTS]: {
        path: RoutePath.appointments,
        element: <AppoimentsPage />,
        authOnly: true,
    },
    [AppRoutes.APPOINTMENT_DETAILS]: {
        path: `${RoutePath.appointment_details}:id`,
        element: <AppoimentDetailPage />,
        authOnly: true,
    },
    [AppRoutes.PROFILE]: {
        path: `${RoutePath.profile}:id`,
        element: <ProfilePage />,
        authOnly: true,
    },
    [AppRoutes.TRANSACTIONS]: {
        path: RoutePath.transactions,
        element: <TransactionsPage />,
        authOnly: true,
    },
    [AppRoutes.CLIENTS]: {
        path: RoutePath.clients,
        element: <ClientsPage />,
        authOnly: true,
    },
    [AppRoutes.CLIENTS_DETAILS]: {
        path: `${RoutePath.client_details}:id`,
        element: <ClientsDetailsPage />,
        authOnly: true,
    },
    [AppRoutes.PATIENT_DETAILS]: {
        path: `${RoutePath.patient_details}:id`,
        element: <PatientDetailsPage />,
        authOnly: true,
    },
    [AppRoutes.PROCEDURES]: {
        path: RoutePath.procedures,
        element: <ProceduresPage />,
        authOnly: true,
    },
    [AppRoutes.PROCEDURES_CREATE]: {
        path: RoutePath.procedures_create,
        element: <ProcedureCreatePage />,
        authOnly: true,
    },
    [AppRoutes.PROCEDURES_DETAILS]: {
        path: `${RoutePath.procedures_details}:id`,
        element: <ProcedureDetailsPage />,
        authOnly: true,
    },
    [AppRoutes.PROCEDURES_EDIT]: {
        path: `${RoutePath.procedures_edit}:id`,
        element: <ProcedureEditPage />,
        authOnly: true,
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath.settings,
        element: <SettingsPage />,
        authOnly: true,
    },
    [AppRoutes.INTEGRATIONS]: {
        path: RoutePath.integrations,
        element: <IntegrationsPage />,
        authOnly: true,
    },
    [AppRoutes.CALENDAR]: {
        path: RoutePath.calendar,
        element: <CalendarPage />,
        authOnly: true,
    },
    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
        authOnly: true,
    },
};
