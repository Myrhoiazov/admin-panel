import { StoreType } from "@/app/providers/StoreProvider";
import axios from "axios";
import { userActions } from "@/entities/User";

let store: StoreType

export const injectStore = (_store: StoreType) => {
    store = _store
}

export const $api = axios.create({
    baseURL: __API__ + '/api/v1',
    withCredentials: true
})

export const $apiPrivate = axios.create({
    baseURL: __API__ + "/api/v1",
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

// Auth lives entirely in the httpOnly session cookie now — nothing to attach here in JS.
// Because of that, mutating requests need a CSRF token (double-submit cookie: the server sets
// a readable csrf_token cookie, we mirror its value into a header it can compare against).
const readCsrfCookie = (): string | undefined => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
};

const attachCsrfHeader = (config: import('axios').InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();
    if (method && MUTATING_METHODS.has(method)) {
        const csrfToken = readCsrfCookie();
        if (csrfToken) {
            config.headers[CSRF_HEADER_NAME] = csrfToken;
        }
    }
    return config;
};

$api.interceptors.request.use(attachCsrfHeader);
$apiPrivate.interceptors.request.use(attachCsrfHeader);

// A 401 here means the session cookie is missing, expired, or revoked — there is no separate
// short-lived access token to silently refresh anymore (isAuthenticated re-checks the same
// cookie against the DB on every request), so retrying via /auth/refresh would just fail the
// same way. Clear any stale client-side auth state instead and let route guards redirect.
$apiPrivate.interceptors.response.use(
    res => res,
    async error => {
        if (error.response?.status === 401 && error.config?.url !== '/auth/refresh') {
            store.dispatch(userActions.logout());
        }
        throw error;
    }
);