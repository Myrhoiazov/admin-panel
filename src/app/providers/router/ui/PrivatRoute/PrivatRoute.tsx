import { getUserAuthData, getUserInited } from '@/entities/User';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '@/shared/ui/Loader/Loader';

const PrivatRoute = ({ children }: { children: React.ReactNode }) => {
    const authData = useSelector(getUserAuthData);
    const inited = useSelector(getUserInited);

    if (!inited) {
        return <Loader />;
    }

    return authData ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivatRoute;
