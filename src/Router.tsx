import { FC, memo } from "react";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";
import { PagePath } from "./shared/constants";
import { LoginPage } from "pages/authenticate/LoginPage";
import { RequireAuth } from "components/wrappers/RequireAuth";
import { DashboardPage } from "pages/DashboardPage";

export const Router: FC = memo(() => {
  return (
    <MemoryRouter
      initialEntries={["/"]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={<Navigate to={PagePath.Dashboard} replace />}
        />
        <Route path={PagePath.Login} element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path={PagePath.Dashboard} element={<DashboardPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
});

Router.displayName = "Router";
