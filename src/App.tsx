import { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";

// Assets
import { ADMIN_ROUTES, TRoute, ROUTES } from "./routes";

// Components
import { Layout } from "./components";

// Contexts
import { AuthContext, TAuthContext } from "./providers/auth.provider";

const App = () => {
  const { isUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;
  const { pathname } = useLocation();

  const routeElement = (route: TRoute): any =>
    route.path === "/log-in" && isUserAuthenticated ? (
      <Navigate to="/admin" replace />
    ) : (
      route.element
    );

  const adminRouteElement = (route: TRoute): any => {
    return isUserAuthenticated ? (
      route.element
    ) : (
      <Navigate to="/log-in" replace />
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Layout>
      <Routes>
        {ROUTES.map((route: TRoute, index: number) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={routeElement(route)}
            />
          );
        })}
        {ADMIN_ROUTES.map((adminRoute: TRoute, index: number) => {
          return (
            <Route
              key={index}
              path={adminRoute.path}
              element={adminRouteElement(adminRoute)}
            />
          );
        })}
      </Routes>
    </Layout>
  );
};

export default App;
