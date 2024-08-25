import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

function PrivateRoutes() {
  const token = useAuth();
  console.log('ocation.pathname.includes(\'/jobs\'): ', location.pathname.includes('/jobs'))
  if (location.pathname !== '/' && !location.pathname.includes('/jobs'))
    return token ? <Outlet /> : <Navigate to="/login" />;
  else return <Outlet />;
}

export default PrivateRoutes;
