import { lazy, Suspense } from "react";
import { Navigate, Routes as RRRoutes, Route } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout";
import LoadingSpinner from "./components/loading-spinner";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const NewChat = lazy(() => import("@/pages/NewChat"));
const PublishedNews = lazy(() => import("@/pages/PublishedNews"));
const SingleChat = lazy(() => import("@/pages/chats/SingleChat"));
const RecentChats = lazy(() => import("@/pages/chats/RecentChats"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Routes = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RRRoutes>
        {auth?.user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<NewChat />} />
            <Route path="new" element={<NewChat />} />
            <Route path="chats" element={<RecentChats />} />
            <Route path="chats/:chatId" element={<SingleChat />} />
            <Route path="published-news" element={<PublishedNews />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
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
