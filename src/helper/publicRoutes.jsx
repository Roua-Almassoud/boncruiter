import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

function PublicRoutes() {
  const token = useAuth();
  if (location.pathname !== '/')
    return token ? <Navigate to="/" /> : <Outlet />;
  else return <Outlet />;
}

export default PublicRoutes;
