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

// $apiPrivate.interceptors.request.use((config) => {
//     if (config.headers) {
//     }
//     return config;
// });

$apiPrivate.interceptors.request.use(config => {
    const token = store.getState().user.authData?.token ?? ''
    config.headers.authorization = `Bearer ${token}`;
    return config
})

export const serviceToken = {
    set(token: string) {
        // $apiPrivate.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    unset() {
        $apiPrivate.defaults.headers.common.Authorization = null;
    },
};


$apiPrivate.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (originalRequest.url == '/auth/refresh') {
            return;
        }

        if (error.response?.status === 401 && error.config && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                const { data } = await $apiPrivate.get('/auth/refresh', { withCredentials: true });
                if (!data) {
                    throw error
                }
                store.dispatch(userActions.setAuthData(data))
                return $apiPrivate.request(originalRequest);
            } catch (err) {
                console.log("err: ", err);
            }
        }
        throw error
    }
);