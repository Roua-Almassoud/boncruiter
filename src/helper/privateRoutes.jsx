import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

function PrivateRoutes() {
  const token = useAuth();
  if (location.pathname !== '/')
    return token ? <Outlet /> : <Navigate to="/login" />;
  else return <Outlet />;
}

export default PrivateRoutes;
