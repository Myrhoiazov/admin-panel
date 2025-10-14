import { RouteProps } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticleDetailsPage } from '@/pages/ArticleDetailsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { LoginPage } from '@/pages/AuthPage';
import { ClientsDetailsPage } from '@/pages/ClientsDetailsPage';
import { ProceduresPage } from '@/pages/ProceduresPage';
import { ProcedureEditPage } from '@/pages/ProcedureEditPage';
import { ProcedureDetailsPage } from '@/pages/ProcedureDetailsPage';
import { ProcedureCreatePage } from '@/pages/ProcedureCreatePage';
import { AppoimentsPage } from '@/pages/AppoimentsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppoimentDetailPage } from '@/pages/AppoimentDetailPage';

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    LOGIN = 'login',
    MAIN = 'main',
    ABOUT = 'about',
    APPOINTMENTS = 'appointments',
    APPOINTMENT_DETAILS = 'appointment_details',
    PROFILE = 'profile',
    TRANSACTIONS = 'transactions',
    ARTICLES = 'articles',
    ARTICLE_DETAILS = 'article_details',
    CLIENTS = 'clients',
    CLIENTS_DETAILS = 'client_details',
    PROCEDURES = 'procedures',
    PROCEDURES_DETAILS = 'procedures_details',
    PROCEDURES_EDIT = 'procedures_edit',
    PROCEDURES_CREATE = 'procedures_create',
    SETTINGS = 'settings',
    // last
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.ABOUT]: '/about',
    [AppRoutes.APPOINTMENTS]: '/appointments',
    [AppRoutes.PROFILE]: '/profile/',
    [AppRoutes.ARTICLES]: '/articles',
    [AppRoutes.TRANSACTIONS]: '/transactions',
    [AppRoutes.CLIENTS]: '/clients',
    [AppRoutes.CLIENTS_DETAILS]: '/clients/',
    [AppRoutes.ARTICLE_DETAILS]: '/articles/', // + :id
    [AppRoutes.PROCEDURES]: '/procedures',
    [AppRoutes.PROCEDURES_CREATE]: '/procedures/create',
    [AppRoutes.PROCEDURES_DETAILS]: '/procedures/', // :id
    [AppRoutes.PROCEDURES_EDIT]: '/procedures/edit/', // :id
    [AppRoutes.APPOINTMENT_DETAILS]: '/appointments/', // + :id
    [AppRoutes.SETTINGS]: '/settings',
    // последний
    [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage />,
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
    [AppRoutes.ARTICLES]: {
        path: RoutePath.articles,
        element: <ArticlesPage />,
        authOnly: true,
    },
    [AppRoutes.TRANSACTIONS]: {
        path: RoutePath.transactions,
        element: <TransactionsPage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_DETAILS]: {
        path: `${RoutePath.article_details}:id`,
        element: <ArticleDetailsPage />,
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
    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFoundPage />,
        authOnly: true,
    },
};
