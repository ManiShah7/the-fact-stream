import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout";

const LoginPage = lazy(() => import("./pages/LoginPage"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RRRoutes>
        {!auth?.user ? (
          <Route path="" element={<Layout />}>
            <Route path="/" element={<div>Auth</div>} />

            <Route path="*" element={<>404 Not Found</>} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
