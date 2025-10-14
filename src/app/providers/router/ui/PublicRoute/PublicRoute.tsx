import { getUserToken } from '@/entities/User';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

interface PublicRouteProps {
    restricted?: boolean;
    to?: string;
    children: React.ReactNode;
}

const PublicRoute = ({ restricted = false, to, children }: PublicRouteProps) => {
    const token = useSelector(getUserToken);
    const shouldRedirect = token && restricted;

    return shouldRedirect ? <Navigate to={RoutePath.main} /> : <>{children}</>;
};

export default PublicRoute;
