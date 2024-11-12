import { FC, memo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PagePath } from "../../shared/constants";
import { useUserStorage } from "common/hooks/useUserStorage";

export const RequireAuth: FC = memo(() => {
  const { user, isLoading } = useUserStorage();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={PagePath.Login} state={{ from: location }} replace />
  );
});
