import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/loading-spinner";
import NavWrapper from "@/components/NavWrapper";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const PublishedNewsPage = lazy(() => import("@/pages/PublishedNewsPage"));
const SingleAnalysis = lazy(() => import("@/pages/analyses/SingleAnalysis"));
const AllAnalyses = lazy(() => import("@/pages/analyses/AllAnalyses"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RRRoutes>
        <Route path="/" element={<NavWrapper />}>
          <Route path="/" element={<HomePage />} />
          {auth.authState.isLoading ? (
            <Route path="/" element={<LoadingSpinner />} />
          ) : auth?.authState.user ? (
            <>
              <Route
                path="/login"
                element={<Navigate to="/analyses" replace />}
              />
              <Route path="/analyses" element={<AllAnalyses />} />
              <Route path="/analyses/:chatId" element={<SingleAnalysis />} />
              <Route path="/published-news" element={<PublishedNewsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password"
                element={<>Reset Password Page</>}
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Route>
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
