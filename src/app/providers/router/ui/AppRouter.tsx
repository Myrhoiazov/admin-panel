import { Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRoutesProps, routeConfig } from 'shared/config/routeConfig/routeConfig';
import Loader from 'shared/ui/Loader/Loader';
import PublicRoute from './PublicRoute/PublicRoute';
import PrivatRoute from './PrivatRoute/PrivatRoute';

const AppRouter = () => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = <Suspense fallback={<Loader />}>{route.element}</Suspense>;

        if (route.authOnly) {
            return (
                <Route
                    path={route.path}
                    key={route.path}
                    // eslint-disable-next-line react/no-children-prop
                    element={<PrivatRoute children={element} />}
                />
            );
        }

        return (
            <Route
                key={route.path}
                path={route.path}
                // eslint-disable-next-line react/no-children-prop
                element={<PublicRoute restricted children={element} />}
            />
        );
    }, []);

    return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
};

export default AppRouter;
