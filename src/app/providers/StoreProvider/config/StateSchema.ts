import { UserSchema } from 'entities/User';
import {
    EnhancedStore,
    Reducer,
    ReducersMapObject,
    Action,
} from '@reduxjs/toolkit';
import { ProfileSchema } from 'entities/Profile';
import { AxiosInstance } from 'axios';
import { ArticleDetailsSchema } from 'entities/Article';
import { ArticleDetailsCommentsSchema } from 'pages/ArticleDetailsPage';
import { AddCommentFormSchema } from 'features/AddCommentForm';
import { ArticlePageSchema } from 'pages/ArticlesPage';
import { LoginSchema } from 'features/Auth/model/types/loginSchema';
import { ClientPageSchema } from 'pages/ClientsPage/model/types/ClientPageSchema';
import { ClientSchema } from 'features/addClientForm';
import { ClientDetailsSchema } from 'entities/Client';
import { AddProcedureFormSchema } from 'features/addProcedureForm';
import { ProcedureDetailsSchema } from 'entities/Procedure';
import { ProcedurePageSchema } from 'pages/ProceduresPage';
import { ClientDetailsAppointmentSchema, ClientDetailsCommentsSchema } from 'pages/ClientsDetailsPage';
import { UISchema } from 'features/UI';
import { TransactionsPageSchema } from 'pages/TransactionsPage';
import { AddTransactionFormSchema } from 'features/addTransactionForm';
import { AppointmentSchema } from 'features/addAppoimentForm';
import { AppoimentPageSchema } from 'pages/AppoimentsPage';
import { UserFormSchema } from 'features/addUserForm';
import { SettingsPageSchema } from 'pages/SettingsPage';

export interface StateSchema {
    user: UserSchema;
    ui: UISchema;

    // Асинхронные редюсеры
    loginForm?: LoginSchema;
    profile?: ProfileSchema;

    client?: ClientSchema;
    clientDetails?: ClientDetailsSchema
    clientDetailsComments?: ClientDetailsCommentsSchema;
    clientDetailsAppointments?: ClientDetailsAppointmentSchema;
    clientsPage?: ClientPageSchema

    newUser?: UserFormSchema;
    settingsPage?: SettingsPageSchema;

    addAppoimentForm?: AppointmentSchema;
    appoimentPage?: AppoimentPageSchema;

    articleDetails?: ArticleDetailsSchema;
    articleDetailsComments?: ArticleDetailsCommentsSchema;
    addCommentForm?: AddCommentFormSchema;
    articlesPage?: ArticlePageSchema;

    proceduresPage?: ProcedurePageSchema
    procedureDetails?: ProcedureDetailsSchema
    addProcedureForm?: AddProcedureFormSchema;

    transactionPage?: TransactionsPageSchema
    addTransactionForm?: AddTransactionFormSchema
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema, action: Action) => CombinedState<StateSchema>;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance,
    apiPrivate: AxiosInstance,
}

export interface ThunkConfig<T> {
    rejectValue: T
    extra: ThunkExtraArg,
    state: StateSchema;
}
