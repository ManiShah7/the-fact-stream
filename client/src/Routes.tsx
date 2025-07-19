import { lazy, Suspense } from "react";
import { Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "./hooks/useAuth";

const LoginPage = lazy(() => import("./pages/LoginPage"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RRRoutes>
        {auth?.user ? (
          <>Auth</>
        ) : (
          <>
            <Route path="/" element={<LoginPage />} />
          </>
        )}
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
