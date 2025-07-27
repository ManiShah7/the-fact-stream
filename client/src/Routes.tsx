import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout";
import LoadingSpinner from "./components/loading-spinner";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const NewChatPage = lazy(() => import("@/pages/NewChatPage"));
const PublishedNewsPage = lazy(() => import("@/pages/PublishedNewsPage"));
const SingleChat = lazy(() => import("@/pages/chats/SingleChat"));
const RecentChats = lazy(() => import("@/pages/chats/RecentChats"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RRRoutes>
        {auth?.user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<NewChatPage />} />
            <Route path="new" element={<NewChatPage />} />
            <Route path="chats" element={<RecentChats />} />
            <Route path="chats/:chatId" element={<SingleChat />} />
            <Route path="published-news" element={<PublishedNewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </RRRoutes>
    </Suspense>
  );
};

export default Routes;
