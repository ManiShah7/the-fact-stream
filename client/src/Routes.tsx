import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout";
import LoadingSpinner from "@/components/loading-spinner";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const NewChatPage = lazy(() => import("@/pages/NewChatPage"));
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
        {auth?.loading ? (
          <Route path="*" element={<LoadingSpinner />} />
        ) : auth?.user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="new" />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/new" element={<NewChatPage />} />
            <Route path="/analyses" element={<AllAnalyses />} />
            <Route path="/analyses/:chatId" element={<SingleAnalysis />} />
            <Route path="/published-news" element={<PublishedNewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<>Reset Password Page</>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
